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
    <div className="absolute top-6 right-6 flex flex-col gap-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-3">
      <button
        onClick={zoomIn}
        className="p-2.5 hover:bg-blue-50 rounded-xl transition-all hover:shadow-md group"
        title="Zoom In"
      >
        <ZoomIn size={20} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
      </button>
      <button
        onClick={zoomOut}
        className="p-2.5 hover:bg-blue-50 rounded-xl transition-all hover:shadow-md group"
        title="Zoom Out"
      >
        <ZoomOut size={20} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
      </button>
      <button
        onClick={fitToView}
        className="p-2.5 hover:bg-blue-50 rounded-xl transition-all hover:shadow-md group"
        title="Fit to View"
      >
        <Maximize2 size={20} className="text-gray-700 group-hover:text-blue-600 transition-colors" />
      </button>
      <div className="px-3 py-2 text-xs font-bold text-blue-900 text-center border-t border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg mt-1">
        {(viewport.zoom * 100).toFixed(0)}%
      </div>
    </div>
  );
}
