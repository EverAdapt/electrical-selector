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
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  
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

  // Click to add device
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    
    // Don't handle click if it's on a device (let device handle it)
    const target = e.target as SVGElement;
    if (target.closest('#devices g[transform]')) {
      return; // Let the device handle its own click/drag
    }
    
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    
    let { x, y } = pt.matrixTransform(ctm.inverse());
    
    // If in select mode, just deselect
    if (mode === 'select') {
      setTooltipNodeId(null);
      selectNode(null);
      return;
    }
    
    let rotation = 0;
    
    let kind: 'power' | 'light' | 'switch' = 'power';
    if (mode === 'add-light') kind = 'light';
    else if (mode === 'add-switch') kind = 'switch';
    
    // Enforce wall snapping for power points and switches with large tolerance
    if (kind === 'power' || kind === 'switch') {
      const snap = snapToWalls(wallIndex, x, y, 200); // Large tolerance - always finds a wall in a room
      if (snap) {
        x = snap.x;
        y = snap.y;
        rotation = (snap.angle * 180) / Math.PI;
      }
      // If still no snap, try with even larger tolerance
      else {
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
      const createdNode = nodes[nodes.length - 1];
      if (!createdNode) return;
      
      const nodeId = createdNode.id;
      
      // Auto-create switch for lights
      if (kind === 'light') {
        // Place switch 100px to the right and snap to wall with large tolerance
        let switchX = x + 100;
        let switchY = y;
        let switchRotation = 0;
        
        const switchSnap = snapToWalls(wallIndex, switchX, switchY, 200);
        if (switchSnap) {
          switchX = switchSnap.x;
          switchY = switchSnap.y;
          switchRotation = (switchSnap.angle * 180) / Math.PI;
        } else {
          // Try even larger tolerance
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
        
        // Get switch ID after it's created
        setTimeout(() => {
          const switchNode = nodes[nodes.length - 1];
          if (!switchNode) return;
          
          // Create edge connecting light and switch
          addEdge({
            source: nodeId,
            target: switchNode.id,
            data: {},
          });
        }, 0);
      }
      
      // Show tooltip for the created device
      setTooltipNodeId(nodeId);
      setTooltipPosition({ x: e.clientX, y: e.clientY });
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
      
      {/* Device Tooltip */}
      {tooltipNodeId && (() => {
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
