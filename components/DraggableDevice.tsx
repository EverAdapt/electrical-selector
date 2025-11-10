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
  IconSwitchDimmer,
} from './icons';

interface DraggableDeviceProps {
  node: DeviceNode;
  wallIndex: RBush<SegmentItem>;
  isSelected: boolean;
  onShowTooltip?: (nodeId: string, position: { x: number; y: number }) => void;
}

export function DraggableDevice({ node, wallIndex, isSelected, onShowTooltip }: DraggableDeviceProps) {
  const updateNode = useFloorplanStore((s) => s.updateNode);
  const selectNode = useFloorplanStore((s) => s.selectNode);
  const deleteNode = useFloorplanStore((s) => s.deleteNode);
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStarted, setDragStarted] = React.useState(false);
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
        const snap = snapToWalls(wallIndex, local.x, local.y, 200);
        if (snap) {
          updateNode(node.id, {
            position: { x: snap.x, y: snap.y },
            rotation: radToDeg(snap.angle),
          });
        } else {
          const largeSnap = snapToWalls(wallIndex, local.x, local.y, 500);
          if (largeSnap) {
            updateNode(node.id, {
              position: { x: largeSnap.x, y: largeSnap.y },
              rotation: radToDeg(largeSnap.angle),
            });
          }
        }
        
        // Update tooltip position
        if (onShowTooltip && draggingRef.current) {
          const screenPos = svg.createSVGPoint();
          screenPos.x = snap?.x || largeSnap?.x || local.x;
          screenPos.y = snap?.y || largeSnap?.y || local.y;
          const ctm2 = svg.getScreenCTM();
          if (ctm2) {
            const transformed = screenPos.matrixTransform(ctm2);
            onShowTooltip(node.id, { x: transformed.x, y: transformed.y });
          }
        }
      } else {
        // Light - free movement
        const snap = snapToWalls(wallIndex, local.x, local.y, 15);
        if (snap) {
          updateNode(node.id, {
            position: { x: snap.x, y: snap.y },
            rotation: radToDeg(snap.angle),
          });
        } else {
          updateNode(node.id, {
            position: local,
          });
        }
        
        // Update tooltip position
        if (onShowTooltip && draggingRef.current) {
          const screenPos = svg.createSVGPoint();
          screenPos.x = snap?.x || local.x;
          screenPos.y = snap?.y || local.y;
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
          
          {/* Wall constraint indicator for power/switch */}
          {(node.kind === 'power' || node.kind === 'switch') && (
            <g opacity={0.5}>
              <line
                x1={-30}
                y1={0}
                x2={30}
                y2={0}
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="2 2"
              />
              <text
                x={0}
                y={-30}
                fontSize={9}
                fill="#ef4444"
                textAnchor="middle"
                fontWeight="bold"
                style={{ pointerEvents: 'none' }}
              >
                WALL ONLY
              </text>
            </g>
          )}
          
          {/* Free drag indicator for lights */}
          {node.kind === 'light' && (
            <text
              x={0}
              y={-30}
              fontSize={9}
              fill="#10b981"
              textAnchor="middle"
              fontWeight="bold"
              style={{ pointerEvents: 'none' }}
            >
              FREE DRAG
            </text>
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
        case 'dimmer': return IconSwitchDimmer;
        default: return IconSwitch1Gang;
      }
    
    default:
      return IconPowerSingle;
  }
}
