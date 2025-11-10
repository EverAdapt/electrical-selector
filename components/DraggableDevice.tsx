'use client';

import React from 'react';
import RBush from 'rbush';
import { snapToWalls, radToDeg } from '@/lib/snap';
import { useFloorplanStore } from '@/lib/store';
import type { DeviceNode, SegmentItem } from '@/lib/types';
import {
  IconPowerSingle,
  IconPowerDouble,
  IconLightCeiling,
  IconLightWall,
  IconSwitch1Gang,
  IconSwitch2Gang,
  IconSwitch3Gang,
  IconSwitch4Gang,
  IconSwitchDimmer,
} from './icons';

interface DraggableDeviceProps {
  node: DeviceNode;
  wallIndex: RBush<SegmentItem>;
  isSelected: boolean;
  onShowTooltip?: (nodeId: string, position: { x: number; y: number }) => void;
  onAlignmentGuides?: (guides: { x?: number; y?: number } | null) => void;
}

export function DraggableDevice({ node, wallIndex, isSelected, onShowTooltip, onAlignmentGuides }: DraggableDeviceProps) {
  const updateNode = useFloorplanStore((s) => s.updateNode);
  const selectNode = useFloorplanStore((s) => s.selectNode);
  const deleteNode = useFloorplanStore((s) => s.deleteNode);
  const addNode = useFloorplanStore((s) => s.addNode);
  const nodes = useFloorplanStore((s) => s.nodes);
  const edges = useFloorplanStore((s) => s.edges);
  const addEdge = useFloorplanStore((s) => s.addEdge);
  const deleteEdge = useFloorplanStore((s) => s.deleteEdge);
  const batchUpdate = useFloorplanStore((s) => s.batchUpdate);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStarted, setDragStarted] = React.useState(false);
  const [snappedLightId, setSnappedLightId] = React.useState<string | null>(null);
  const dragRef = React.useRef<SVGGElement>(null);
  const draggingRef = React.useRef(false);

  // Handle drag with inline event handlers (more reliable than hook)
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    draggingRef.current = true;
    setDragStarted(true);
    setIsDragging(true);
    selectNode(node.id);
    
    // Show tooltip
    if (onShowTooltip) {
      onShowTooltip(node.id, { x: e.clientX, y: e.clientY });
    }
  };

  // Mouse move and up handlers need to be on window
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      
      const svg = dragRef.current?.ownerSVGElement;
      if (!svg) return;
      
      // Transform to SVG coordinates
      const pt = svg.createSVGPoint();
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const local = pt.matrixTransform(ctm.inverse());
      
      
      // Apply constraints based on device type
      if (node.kind === 'power' || node.kind === 'switch') {
        let finalX = local.x;
        let finalY = local.y;
        let finalRotation = 0;
        let snappedToLight = false;
        
        // FOR SWITCHES: Check for nearby lights FIRST (higher priority than walls)
        if (node.kind === 'switch') {
          const LIGHT_SNAP_RADIUS = 100; // Large radius for easy targeting
          const nearbyLight = nodes.find(n => 
            n.id !== node.id && 
            n.kind === 'light' &&
            Math.abs(n.position.x - local.x) < LIGHT_SNAP_RADIUS &&
            Math.abs(n.position.y - local.y) < LIGHT_SNAP_RADIUS
          );
          
          if (nearbyLight) {
            // Snap to the light position
            finalX = nearbyLight.position.x;
            finalY = nearbyLight.position.y;
            snappedToLight = true;
            setSnappedLightId(nearbyLight.id);
            console.log('Switch snapping to light:', nearbyLight.id);
            
            updateNode(node.id, {
              position: { x: finalX, y: finalY },
              rotation: 0,
            });
          } else {
            setSnappedLightId(null);
          }
        }
        
        // If not snapped to light, try wall snapping
        if (!snappedToLight) {
          const snap = snapToWalls(wallIndex, local.x, local.y, 200);
          if (snap) {
            finalX = snap.x;
            finalY = snap.y;
            finalRotation = radToDeg(snap.angle);
            updateNode(node.id, {
              position: { x: snap.x, y: snap.y },
              rotation: radToDeg(snap.angle),
            });
          } else {
            const largeSnap = snapToWalls(wallIndex, local.x, local.y, 500);
            if (largeSnap) {
              finalX = largeSnap.x;
              finalY = largeSnap.y;
              finalRotation = radToDeg(largeSnap.angle);
              updateNode(node.id, {
                position: { x: largeSnap.x, y: largeSnap.y },
                rotation: radToDeg(largeSnap.angle),
              });
            }
          }
        }
        
        // Update tooltip position
        if (onShowTooltip && draggingRef.current) {
          const screenPos = svg.createSVGPoint();
          screenPos.x = finalX;
          screenPos.y = finalY;
          const ctm2 = svg.getScreenCTM();
          if (ctm2) {
            const transformed = screenPos.matrixTransform(ctm2);
            onShowTooltip(node.id, { x: transformed.x, y: transformed.y });
          }
        }
      } else {
        // Light - free movement with alignment guides
        let finalX = local.x;
        let finalY = local.y;
        const guides: { x?: number; y?: number } = {};
        const SNAP_THRESHOLD = 20; // pixels
        
        // Check alignment with other lights
        const otherLights = nodes.filter(n => n.kind === 'light' && n.id !== node.id);
        
        for (const otherLight of otherLights) {
          // Horizontal alignment
          if (Math.abs(local.y - otherLight.position.y) < SNAP_THRESHOLD) {
            finalY = otherLight.position.y;
            guides.y = otherLight.position.y;
          }
          
          // Vertical alignment
          if (Math.abs(local.x - otherLight.position.x) < SNAP_THRESHOLD) {
            finalX = otherLight.position.x;
            guides.x = otherLight.position.x;
          }
        }
        
        onAlignmentGuides?.(Object.keys(guides).length > 0 ? guides : null);
        
        // Try wall snap first
        const snap = snapToWalls(wallIndex, finalX, finalY, 15);
        if (snap) {
          updateNode(node.id, {
            position: { x: snap.x, y: snap.y },
            rotation: radToDeg(snap.angle),
          });
          finalX = snap.x;
          finalY = snap.y;
        } else {
          updateNode(node.id, {
            position: { x: finalX, y: finalY },
          });
        }
        
        // Update tooltip position
        if (onShowTooltip && draggingRef.current) {
          const screenPos = svg.createSVGPoint();
          screenPos.x = finalX;
          screenPos.y = finalY;
          const ctm2 = svg.getScreenCTM();
          if (ctm2) {
            const transformed = screenPos.matrixTransform(ctm2);
            onShowTooltip(node.id, { x: transformed.x, y: transformed.y });
          }
        }
      }
    };
    
    const handleMouseUp = () => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setIsDragging(false);
      setSnappedLightId(null);
      onAlignmentGuides?.(null);
      
      // Switch combining logic - if a switch is dropped on another switch or near lights
      if (node.kind === 'switch') {
        // PRIORITY 1: Check for nearby light FIRST (create light-to-light mesh)
        const nearbyLight = nodes.find(n => 
          n.id !== node.id && 
          n.kind === 'light' &&
          Math.abs(n.position.x - node.position.x) < 100 &&
          Math.abs(n.position.y - node.position.y) < 100
        );
        
        if (nearbyLight) {
          console.log('Switch dragged onto light:', nearbyLight.id);
          
          // Get the light(s) connected to this switch
          const switchLights = edges.filter(e => 
            (e.source === node.id && nodes.find(n => n.id === e.target)?.kind === 'light') ||
            (e.target === node.id && nodes.find(n => n.id === e.source)?.kind === 'light')
          ).map(e => e.source === node.id ? e.target : e.source);
          
          console.log('Switch was connected to lights:', switchLights);
          
          // Connect all switch's lights directly to the nearby light (mesh)
          switchLights.forEach(lightId => {
            if (lightId !== nearbyLight.id) {
              console.log('Creating light-to-light connection:', lightId, '<->', nearbyLight.id);
              addEdge({
                source: lightId,
                target: nearbyLight.id,
              });
            }
          });
          
          // Delete the switch (it's no longer needed)
          console.log('Deleting switch:', node.id);
          deleteNode(node.id);
          
          return; // Exit early
        }
        
        // PRIORITY 2: Check for nearby switch (combine into multi-gang switch)
        const nearbySwitch = nodes.find(n => 
          n.id !== node.id && 
          n.kind === 'switch' &&
          Math.abs(n.position.x - node.position.x) < 50 &&
          Math.abs(n.position.y - node.position.y) < 50
        );
        
        if (nearbySwitch) {
          console.log('Combining switches into multi-gang:', node.id, nearbySwitch.id);
          
          // Get all lights connected to both switches
          const thisLights = edges.filter(e => 
            (e.source === node.id && nodes.find(n => n.id === e.target)?.kind === 'light') ||
            (e.target === node.id && nodes.find(n => n.id === e.source)?.kind === 'light')
          ).map(e => e.source === node.id ? e.target : e.source);
          
          const nearbyLights = edges.filter(e => 
            (e.source === nearbySwitch.id && nodes.find(n => n.id === e.target)?.kind === 'light') ||
            (e.target === nearbySwitch.id && nodes.find(n => n.id === e.source)?.kind === 'light')
          ).map(e => e.source === nearbySwitch.id ? e.target : e.source);
          
          const allLights = [...new Set([...thisLights, ...nearbyLights])];
          const lightCount = allLights.length;
          
          console.log('This switch lights:', thisLights);
          console.log('Nearby switch lights:', nearbyLights);
          console.log('Total unique lights:', lightCount, allLights);
          
          if (lightCount >= 2 && lightCount <= 4) {
            // Determine new switch type based on number of lights
            const newSwitchType = `${lightCount}g` as '2g' | '3g' | '4g';
            const newSwitchId = `switch-combined-${Date.now()}`;
            
            console.log(`Creating ${newSwitchType} switch with ${lightCount} lights`);
            
            // Use batchUpdate for atomic operation - all changes happen together
            batchUpdate({
              nodesToAdd: [{
                id: newSwitchId,
                kind: 'switch',
                position: {
                  x: (node.position.x + nearbySwitch.position.x) / 2,
                  y: (node.position.y + nearbySwitch.position.y) / 2,
                },
                data: {
                  switchType: newSwitchType,
                  label: `${lightCount} Gang Switch`,
                },
              } as any],
              nodesToDelete: [node.id, nearbySwitch.id],
              edgesToAdd: allLights.map(lightId => ({
                source: lightId,
                target: newSwitchId,
              })),
            });
            
            console.log('Multi-gang switch created!');
            
            return; // Exit early, don't complete normal drag
          }
        }
      }
      
      setTimeout(() => setDragStarted(false), 100);
    };
    
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, node.id, node.kind, updateNode, wallIndex, onShowTooltip]);

  // Handle delete key
  React.useEffect(() => {
    if (!isSelected) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteNode(node.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSelected, node.id, deleteNode]);


  // Select appropriate icon
  const Icon = getIconForNode(node);

  return (
    <g
      ref={dragRef}
      transform={`translate(${node.position.x},${node.position.y}) rotate(${node.rotation || 0})`}
      onMouseDown={handleMouseDown}
      style={{ 
        opacity: isDragging ? 0.7 : 1,
        cursor: 'move'
      }}
    >
      {/* Selection ring */}
      {isSelected && (
        <circle
          cx={0}
          cy={0}
          r={18}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={2}
          opacity={0.5}
        />
      )}
      
      {/* Dragging indicator - larger ring */}
      {isDragging && (
        <>
          <circle
            cx={0}
            cy={0}
            r={24}
            fill="none"
            stroke={node.kind === 'light' ? "#10b981" : "#3b82f6"}
            strokeWidth={2}
            strokeDasharray="4 4"
            opacity={0.6}
          >
            <animate
              attributeName="r"
              from="24"
              to="28"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
          
          {/* Wall-snap indicator for power/switch (hide when snapped to light) */}
          {(node.kind === 'power' || node.kind === 'switch') && !snappedLightId && (
            <line
              x1={-30}
              y1={0}
              x2={30}
              y2={0}
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="2 2"
            />
          )}
        </>
      )}

      {/* Invisible hitbox for easier dragging */}
      <circle
        cx={0}
        cy={0}
        r={20}
        fill="transparent"
        style={{ cursor: 'move' }}
      />

      {/* Icon */}
      <Icon
        width={24}
        height={24}
        x={-12}
        y={-12}
        className="text-gray-800"
        style={{ pointerEvents: 'none' }}
      />

      {/* Label */}
      {node.data?.label && (
        <text
          x={16}
          y={-8}
          fontSize={10}
          fill="#333"
          className="select-none"
          style={{ pointerEvents: 'none' }}
        >
          {node.data.label}
        </text>
      )}

      {/* Circuit ID badge */}
      {node.data?.circuitId && (
        <text
          x={16}
          y={4}
          fontSize={8}
          fill="#666"
          className="select-none"
          style={{ pointerEvents: 'none' }}
        >
          C{node.data.circuitId}
        </text>
      )}
    </g>
  );
}

/**
 * Get the appropriate icon component for a device node
 */
function getIconForNode(node: DeviceNode): React.FC<React.SVGProps<SVGSVGElement>> {
  switch (node.kind) {
    case 'power':
      return node.data?.powerType === 'double' ? IconPowerDouble : IconPowerSingle;
    
    case 'light':
      return node.data?.lightType === 'wall' ? IconLightWall : IconLightCeiling;
    
    case 'switch':
      switch (node.data?.switchType) {
        case '2g': return IconSwitch2Gang;
        case '3g': return IconSwitch3Gang;
        case '4g': return IconSwitch4Gang;
        case 'dimmer': return IconSwitchDimmer;
        default: return IconSwitch1Gang;
      }
    
    default:
      return IconPowerSingle;
  }
}
