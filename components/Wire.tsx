'use client';

import React from 'react';
import { useFloorplanStore } from '@/lib/store';
import type { Edge, DeviceNode } from '@/lib/types';

interface WireProps {
  edge: Edge;
  nodes: DeviceNode[];
}

export function Wire({ edge, nodes }: WireProps) {
  const updateEdge = useFloorplanStore((s) => s.updateEdge);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isHovering, setIsHovering] = React.useState(false);
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  
  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);

  if (!sourceNode || !targetNode) {
    return null;
  }

  // Check if this is a light-switch connection
  const isLightSwitch = 
    (sourceNode.kind === 'light' && targetNode.kind === 'switch') ||
    (sourceNode.kind === 'switch' && targetNode.kind === 'light');
  

  // Calculate control point for curve
  const midX = (sourceNode.position.x + targetNode.position.x) / 2;
  const midY = (sourceNode.position.y + targetNode.position.y) / 2;
  
  // Use stored control point or calculate default
  let cx: number, cy: number;
  if (edge.data?.controlPoint) {
    cx = edge.data.controlPoint.x;
    cy = edge.data.controlPoint.y;
  } else {
    // Default: offset perpendicular to line
    const dx = targetNode.position.x - sourceNode.position.x;
    const dy = targetNode.position.y - sourceNode.position.y;
    const offsetX = -dy * 0.2;
    const offsetY = dx * 0.2;
    cx = midX + offsetX;
    cy = midY + offsetY;
  }

  // Calculate path
  let path: string;
  if (isLightSwitch) {
    // Quadratic Bezier curve with control point
    path = `M ${sourceNode.position.x},${sourceNode.position.y} Q ${cx},${cy} ${targetNode.position.x},${targetNode.position.y}`;
  } else {
    // Straight line for other connections
    path = `M ${sourceNode.position.x},${sourceNode.position.y} L ${targetNode.position.x},${targetNode.position.y}`;
  }

  // Handle dragging the control point
  const handleControlPointDrag = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsDragging(true);

    const svg = (e.target as SVGElement).ownerSVGElement;
    if (!svg) return;
    svgRef.current = svg;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const pt = svg.createSVGPoint();
      pt.x = moveEvent.clientX;
      pt.y = moveEvent.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return;
      const local = pt.matrixTransform(ctm.inverse());

      // Update control point
      updateEdge(edge.id, {
        data: {
          ...edge.data,
          controlPoint: { x: local.x, y: local.y },
        },
      });
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      upEvent.stopPropagation();
      upEvent.preventDefault();
      setIsDragging(false);
      setIsHovering(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <g className="wire">
      {/* Invisible wide path for easier clicking */}
      <path
        d={path}
        stroke="transparent"
        strokeWidth={20}
        fill="none"
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => !isDragging && setIsHovering(false)}
        onMouseDown={handleControlPointDrag}
      />
      
      {/* Background white stroke for contrast */}
      {isLightSwitch && (
        <path
          d={path}
          stroke="#ffffff"
          strokeWidth={6}
          fill="none"
          strokeDasharray="10 8"
          opacity={0.9}
          style={{ pointerEvents: 'none' }}
        />
      )}
      
      {/* Visible wire - MUCH more prominent */}
      <path
        d={path}
        stroke={isLightSwitch ? "#3b82f6" : "#666"}
        strokeWidth={isLightSwitch ? 5 : 1.5}
        fill="none"
        strokeDasharray={isLightSwitch ? "10 8" : "4 2"}
        opacity={isLightSwitch ? 1 : 0.6}
        style={{ pointerEvents: 'none' }}
      />

      {/* Control point handle (only for light-switch and when hovering/dragging) */}
      {isLightSwitch && (isHovering || isDragging) && (
        <>
          {/* Line from control point to path (visual guide) */}
          {isDragging && (
            <>
              <line
                x1={sourceNode.position.x}
                y1={sourceNode.position.y}
                x2={cx}
                y2={cy}
                stroke="#6366f1"
                strokeWidth={1}
                strokeDasharray="2 2"
                opacity={0.3}
              />
              <line
                x1={cx}
                y1={cy}
                x2={targetNode.position.x}
                y2={targetNode.position.y}
                stroke="#6366f1"
                strokeWidth={1}
                strokeDasharray="2 2"
                opacity={0.3}
              />
            </>
          )}
          
          {/* Draggable control point - larger and more visible */}
          <circle
            cx={cx}
            cy={cy}
            r={isDragging ? 12 : 10}
            fill={isDragging ? "#3b82f6" : "#fff"}
            stroke="#3b82f6"
            strokeWidth={3}
            style={{ cursor: 'move' }}
            onMouseDown={handleControlPointDrag}
            opacity={1}
          />
        </>
      )}

      {edge.data?.label && (
        <text
          x={midX}
          y={midY}
          fontSize={10}
          fill="#333"
          className="select-none"
          style={{ pointerEvents: 'none' }}
        >
          {edge.data.label}
        </text>
      )}
    </g>
  );
}
