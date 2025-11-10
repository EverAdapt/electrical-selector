'use client';

import React from 'react';
import { useFloorplanStore } from '@/lib/store';

export function PropertyPanel() {
  const selectedNodeId = useFloorplanStore((s) => s.selectedNodeId);
  const nodes = useFloorplanStore((s) => s.nodes);
  const updateNode = useFloorplanStore((s) => s.updateNode);
  const deleteNode = useFloorplanStore((s) => s.deleteNode);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="font-bold text-lg text-gray-900">Properties</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
          </div>
          <p className="text-sm text-gray-500 text-center">Select a device to view and edit its properties</p>
        </div>
      </div>
    );
  }

  const handleUpdate = (field: string, value: any) => {
    updateNode(selectedNode.id, {
      data: { ...selectedNode.data, [field]: value },
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="font-bold text-lg text-gray-900">Properties</h3>
        </div>
        <button
          onClick={() => deleteNode(selectedNode.id)}
          className="px-3 py-1.5 text-xs text-red-600 hover:text-white hover:bg-red-600 border border-red-600 rounded-lg font-medium transition-all"
        >
          Delete
        </button>
      </div>

      <div className="space-y-4">
        <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200/50">
          <label className="block text-xs font-semibold text-gray-600 mb-1">Device Type</label>
          <div className="text-base font-bold text-blue-900 capitalize">{selectedNode.kind}</div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Label</label>
          <input
            type="text"
            value={selectedNode.data?.label || ''}
            onChange={(e) => handleUpdate('label', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            placeholder="e.g., Kitchen GPO"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Circuit ID</label>
          <input
            type="text"
            value={selectedNode.data?.circuitId || ''}
            onChange={(e) => handleUpdate('circuitId', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            placeholder="e.g., C1"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Height (mm)</label>
          <input
            type="number"
            value={selectedNode.data?.heightMm || ''}
            onChange={(e) => handleUpdate('heightMm', parseInt(e.target.value) || undefined)}
            className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
            placeholder="e.g., 1200"
          />
        </div>

        {selectedNode.kind === 'power' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Power Type</label>
            <select
              value={selectedNode.data?.powerType || 'single'}
              onChange={(e) => handleUpdate('powerType', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white"
            >
              <option value="single">Single GPO</option>
              <option value="double">Double GPO</option>
            </select>
          </div>
        )}

        {selectedNode.kind === 'light' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Light Type</label>
            <select
              value={selectedNode.data?.lightType || 'ceiling'}
              onChange={(e) => handleUpdate('lightType', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white"
            >
              <option value="ceiling">Ceiling Mounted</option>
              <option value="wall">Wall Mounted</option>
            </select>
          </div>
        )}

        {selectedNode.kind === 'switch' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">Switch Type</label>
            <select
              value={selectedNode.data?.switchType || '1g'}
              onChange={(e) => handleUpdate('switchType', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-white"
            >
              <option value="1g">1 Gang</option>
              <option value="2g">2 Gang</option>
              <option value="3g">3 Gang</option>
              <option value="dimmer">Dimmer</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-2">Notes</label>
          <textarea
            value={selectedNode.data?.notes || ''}
            onChange={(e) => handleUpdate('notes', e.target.value)}
            className="w-full px-3 py-2.5 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none resize-none transition-all"
            rows={3}
            placeholder="Additional notes..."
          />
        </div>

        <div className="pt-4 border-t border-gray-200 bg-gradient-to-br from-gray-50 to-slate-50 rounded-lg p-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium">Position:</span>
            <span className="font-mono text-gray-900">({selectedNode.position.x.toFixed(0)}, {selectedNode.position.y.toFixed(0)})</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 font-medium">Rotation:</span>
            <span className="font-mono text-gray-900">{(selectedNode.rotation || 0).toFixed(0)}°</span>
          </div>
        </div>
      </div>
    </div>
  );
}
