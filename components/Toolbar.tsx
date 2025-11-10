'use client';

import React from 'react';
import { useFloorplanStore } from '@/lib/store';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export function Toolbar() {
  const viewport = useFloorplanStore((s) => s.viewport);
  const setViewport = useFloorplanStore((s) => s.setViewport);

  const zoomIn = () => {
    const newZoom = Math.min(5, viewport.zoom * 1.2);
    setViewport({ zoom: newZoom });
  };

  const zoomOut = () => {
    const newZoom = Math.max(0.1, viewport.zoom / 1.2);
    setViewport({ zoom: newZoom });
  };

  const fitToView = () => {
    setViewport({
      zoom: 1,
      pan: { x: 0, y: 0 },
    });
  };

  return (
    <div className="absolute bottom-6 left-6 flex flex-col gap-1.5 bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-2xl border border-gray-700/50 p-2">
      <button
        onClick={zoomIn}
        className="p-2.5 hover:bg-gray-800 rounded-lg transition-all group"
        title="Zoom In"
      >
        <ZoomIn size={18} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
      </button>
      <div className="h-px bg-gray-700" />
      <button
        onClick={zoomOut}
        className="p-2.5 hover:bg-gray-800 rounded-lg transition-all group"
        title="Zoom Out"
      >
        <ZoomOut size={18} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
      </button>
      <div className="h-px bg-gray-700" />
      <button
        onClick={fitToView}
        className="p-2.5 hover:bg-gray-800 rounded-lg transition-all group"
        title="Fit to View"
      >
        <Maximize2 size={18} className="text-gray-300 group-hover:text-blue-400 transition-colors" />
      </button>
      <div className="h-px bg-gray-700" />
      <div className="px-3 py-1.5 text-xs font-semibold text-blue-400 text-center bg-gray-800/50 rounded-md">
        {(viewport.zoom * 100).toFixed(0)}%
      </div>
    </div>
  );
}
