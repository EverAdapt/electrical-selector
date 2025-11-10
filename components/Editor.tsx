'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import RBush from 'rbush';
import { useFloorplanStore } from '@/lib/store';
import { buildWallIndex, parseSVGWalls } from '@/lib/snap';
import type { SegmentItem } from '@/lib/types';
import { DraggableDevice } from './DraggableDevice';
import { Wire } from './Wire';
import { Toolbar } from './Toolbar';
import { DeviceTooltip } from './DeviceTooltip';
import { PlacementMenu } from './PlacementMenu';
import { snapToWalls } from '@/lib/snap';

interface EditorProps {
  width?: number;
  height?: number;
}

export function Editor({ width = 1200, height = 800 }: EditorProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [tooltipNodeId, setTooltipNodeId] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [placementMenu, setPlacementMenu] = useState<{ x: number; y: number; isNearWall: boolean; svgCoords: { x: number; y: number } } | null>(null);
  
  const viewport = useFloorplanStore((s) => s.viewport);
  const setViewport = useFloorplanStore((s) => s.setViewport);
  const background = useFloorplanStore((s) => s.background);
  const walls = useFloorplanStore((s) => s.walls);
  const nodes = useFloorplanStore((s) => s.nodes);
  const edges = useFloorplanStore((s) => s.edges);
  const selectedNodeId = useFloorplanStore((s) => s.selectedNodeId);
  const mode = useFloorplanStore((s) => s.mode);
  const addNode = useFloorplanStore((s) => s.addNode);
  const addEdge = useFloorplanStore((s) => s.addEdge);
  const selectNode = useFloorplanStore((s) => s.selectNode);

  // Build wall spatial index
  const wallIndex = useMemo<RBush<SegmentItem>>(() => {
    return buildWallIndex(walls);
  }, [walls]);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    // Don't start panning if clicking on a device
    const target = e.target as SVGElement;
    if (target.closest('#devices g[transform]')) {
      return; // Let device handle its own drag
    }
    
    if (mode === 'select' && e.button === 0 && !e.shiftKey) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.pan.x, y: e.clientY - viewport.pan.y });
      // Close tooltip when starting to pan
      setTooltipNodeId(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isPanning) {
      setViewport({
        pan: {
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        },
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Zoom handler
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(5, viewport.zoom * delta));
    setViewport({ zoom: newZoom });
  };

  // Click to show placement menu
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    
    // Don't handle click if it's on a device or wire (let them handle it)
    const target = e.target as SVGElement;
    if (target.closest('#devices g[transform]') || target.closest('#wires')) {
      return; // Let the device/wire handle its own interaction
    }
    
    // Close any existing menu or tooltip
    setPlacementMenu(null);
    setTooltipNodeId(null);
    
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    
    let { x, y } = pt.matrixTransform(ctm.inverse());
    
    // Check if near a wall
    const wallSnap = snapToWalls(wallIndex, x, y, 150);
    const isNearWall = wallSnap !== null;
    
    // Show placement menu at click position
    setPlacementMenu({
      x: e.clientX,
      y: e.clientY,
      isNearWall,
      svgCoords: { x, y }
    });
  };

  // Handle placement after menu selection
  const handlePlacement = (kind: 'power' | 'light' | 'switch') => {
    if (!placementMenu) return;
    
    let { x, y } = placementMenu.svgCoords;
    let rotation = 0;
    
    // Close the menu
    setPlacementMenu(null);
    
    // Enforce wall snapping for power points and switches with large tolerance
    if (kind === 'power' || kind === 'switch') {
      const snap = snapToWalls(wallIndex, x, y, 200);
      if (snap) {
        x = snap.x;
        y = snap.y;
        rotation = (snap.angle * 180) / Math.PI;
      } else {
        const largeSnap = snapToWalls(wallIndex, x, y, 500);
        if (largeSnap) {
          x = largeSnap.x;
          y = largeSnap.y;
          rotation = (largeSnap.angle * 180) / Math.PI;
        }
      }
    }
    // Try to snap lights too (but not enforced)
    else {
      const snap = snapToWalls(wallIndex, x, y, 15);
      if (snap) {
        x = snap.x;
        y = snap.y;
        rotation = (snap.angle * 180) / Math.PI;
      }
    }
    
    // Create the main device
    addNode({
      kind,
      position: { x, y },
      rotation,
      data: {},
    });
    
    // Get the ID of the just-created node (it's the last one added)
    setTimeout(() => {
      const currentNodes = useFloorplanStore.getState().nodes;
      const createdNode = currentNodes[currentNodes.length - 1];
      if (!createdNode) {
        return;
      }
      
      const nodeId = createdNode.id;
      
      // Auto-create companion device
      if (kind === 'light') {
        // Auto-create switch for lights
        let switchX = x + 100;
        let switchY = y;
        let switchRotation = 0;
        
        const switchSnap = snapToWalls(wallIndex, switchX, switchY, 200);
        if (switchSnap) {
          switchX = switchSnap.x;
          switchY = switchSnap.y;
          switchRotation = (switchSnap.angle * 180) / Math.PI;
        } else {
          const largeSnap = snapToWalls(wallIndex, switchX, switchY, 500);
          if (largeSnap) {
            switchX = largeSnap.x;
            switchY = largeSnap.y;
            switchRotation = (largeSnap.angle * 180) / Math.PI;
          }
        }
        
        addNode({
          kind: 'switch',
          position: { x: switchX, y: switchY },
          rotation: switchRotation,
          data: { switchType: '1g' },
        });
        
        setTimeout(() => {
          const currentNodes = useFloorplanStore.getState().nodes;
          const switchNode = currentNodes[currentNodes.length - 1];
          if (!switchNode) return;
          
          addEdge({
            source: nodeId,
            target: switchNode.id,
            data: {},
          });
        }, 0);
      } else if (kind === 'switch') {
        // Auto-create light for switches
        let lightX = x - 100;
        let lightY = y - 50;
        
        addNode({
          kind: 'light',
          position: { x: lightX, y: lightY },
          rotation: 0,
          data: { lightType: 'ceiling' },
        });
        
        setTimeout(() => {
          const currentNodes = useFloorplanStore.getState().nodes;
          const lightNode = currentNodes[currentNodes.length - 1];
          if (!lightNode) return;
          
          addEdge({
            source: nodeId,
            target: lightNode.id,
            data: {},
          });
        }, 0);
      }
      
      // Show tooltip for the created device
      setTooltipNodeId(nodeId);
      setTooltipPosition(placementMenu ? { x: placementMenu.x, y: placementMenu.y } : null);
      selectNode(nodeId);
    }, 0);
  };

  // Fit to view
  const fitToView = () => {
    setViewport({
      zoom: 1,
      pan: { x: 0, y: 0 },
    });
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-50 to-gray-100 overflow-hidden">
      <svg
        id="editor-svg"
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`${-viewport.pan.x / viewport.zoom} ${-viewport.pan.y / viewport.zoom} ${width / viewport.zoom} ${height / viewport.zoom}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleClick}
        className="cursor-grab active:cursor-grabbing"
        style={{ cursor: isPanning ? 'grabbing' : mode === 'select' ? 'grab' : 'crosshair' }}
      >
        {/* Background layer */}
        <g id="background">
          {background?.type === 'image' && (
            <image
              href={background.url}
              x={0}
              y={0}
              width={width}
              height={height}
              preserveAspectRatio="xMidYMid meet"
              opacity={0.7}
            />
          )}
          
          {/* Render walls */}
          {walls.map((wall) => (
            <polyline
              key={wall.id}
              points={wall.points.map((p) => `${p.x},${p.y}`).join(' ')}
              stroke="#999"
              strokeWidth={2}
              fill="none"
              opacity={0.5}
            />
          ))}
        </g>

        {/* Grid layer */}
        <g id="grid" opacity={0.2}>
          <defs>
            <pattern id="grid-pattern" x={0} y={0} width={50} height={50} patternUnits="userSpaceOnUse">
              <rect width={50} height={50} fill="none" stroke="#ccc" strokeWidth={0.5} />
            </pattern>
          </defs>
          <rect x={0} y={0} width={width} height={height} fill="url(#grid-pattern)" />
        </g>

        {/* Wires layer */}
        <g id="wires">
          {edges.map((edge) => (
            <Wire key={edge.id} edge={edge} nodes={nodes} />
          ))}
        </g>

        {/* Devices layer */}
        <g id="devices">
          {nodes.map((node) => (
            <DraggableDevice
              key={node.id}
              node={node}
              wallIndex={wallIndex}
              isSelected={node.id === selectedNodeId}
              onShowTooltip={(nodeId, pos) => {
                setTooltipNodeId(nodeId);
                setTooltipPosition(pos);
              }}
            />
          ))}
        </g>
      </svg>

      {/* Toolbar overlay */}
      <Toolbar />
      
      {/* Placement Menu */}
      {placementMenu && (
        <PlacementMenu
          position={{ x: placementMenu.x, y: placementMenu.y }}
          isNearWall={placementMenu.isNearWall}
          onSelect={handlePlacement}
          onClose={() => setPlacementMenu(null)}
        />
      )}
      
      {/* Device Tooltip */}
      {tooltipNodeId && tooltipPosition && (() => {
        const node = nodes.find(n => n.id === tooltipNodeId);
        return node ? (
          <DeviceTooltip
            node={node}
            position={tooltipPosition}
            onClose={() => {
              setTooltipNodeId(null);
              selectNode(null);
            }}
          />
        ) : null;
      })()}
    </div>
  );
}
