'use client';

import React from 'react';
import type { Edge, DeviceNode } from '@/lib/types';

interface WireProps {
  edge: Edge;
  nodes: DeviceNode[];
}

export function Wire({ edge, nodes }: WireProps) {
  const sourceNode = nodes.find((n) => n.id === edge.source);
  const targetNode = nodes.find((n) => n.id === edge.target);

  if (!sourceNode || !targetNode) return null;

  // Check if this is a light-switch connection
  const isLightSwitch = 
    (sourceNode.kind === 'light' && targetNode.kind === 'switch') ||
    (sourceNode.kind === 'switch' && targetNode.kind === 'light');

  // Calculate curved path for light-switch connections
  let path: string;
  if (isLightSwitch) {
    const dx = targetNode.position.x - sourceNode.position.x;
    const dy = targetNode.position.y - sourceNode.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Control point offset for curve (20% of distance perpendicular to line)
    const offsetX = -dy * 0.2;
    const offsetY = dx * 0.2;
    
    const cx = (sourceNode.position.x + targetNode.position.x) / 2 + offsetX;
    const cy = (sourceNode.position.y + targetNode.position.y) / 2 + offsetY;
    
    // Quadratic Bezier curve
    path = `M ${sourceNode.position.x},${sourceNode.position.y} Q ${cx},${cy} ${targetNode.position.x},${targetNode.position.y}`;
  } else {
    // Straight line for other connections
    path = edge.data?.points && edge.data.points.length > 0
      ? `M ${sourceNode.position.x},${sourceNode.position.y} ${edge.data.points.map(p => `L ${p.x},${p.y}`).join(' ')} L ${targetNode.position.x},${targetNode.position.y}`
      : `M ${sourceNode.position.x},${sourceNode.position.y} L ${targetNode.position.x},${targetNode.position.y}`;
  }

  return (
    <g className="wire">
      <path
        d={path}
        stroke={isLightSwitch ? "#6366f1" : "#666"}
        strokeWidth={isLightSwitch ? 3 : 1.5}
        fill="none"
        strokeDasharray={isLightSwitch ? "8 6" : "4 2"}
        opacity={isLightSwitch ? 0.8 : 0.6}
      />
      {edge.data?.label && (
        <text
          x={(sourceNode.position.x + targetNode.position.x) / 2}
          y={(sourceNode.position.y + targetNode.position.y) / 2}
          fontSize={10}
          fill="#333"
          className="select-none"
        >
          {edge.data.label}
        </text>
      )}
    </g>
  );
}
