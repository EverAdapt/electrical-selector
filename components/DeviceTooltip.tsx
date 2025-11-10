'use client';

import React from 'react';
import { X } from 'lucide-react';
import type { DeviceNode } from '@/lib/types';
import { useFloorplanStore } from '@/lib/store';

interface DeviceTooltipProps {
  node: DeviceNode;
  position: { x: number; y: number };
  onClose: () => void;
}

export function DeviceTooltip({ node, position, onClose }: DeviceTooltipProps) {
  const updateNode = useFloorplanStore((s) => s.updateNode);
  const deleteNode = useFloorplanStore((s) => s.deleteNode);

  const handleUpdate = (field: string, value: any) => {
    updateNode(node.id, {
      data: { ...node.data, [field]: value },
    });
  };

  const handleDelete = () => {
    deleteNode(node.id);
    onClose();
  };

  return (
    <div
      className="fixed z-50 bg-white rounded-xl shadow-2xl border-2 border-blue-200 p-4 min-w-[280px] max-w-[320px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -120%)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <span className="font-bold text-gray-900 capitalize">{node.kind}</span>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      {/* Form Fields */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Label</label>
          <input
            type="text"
            value={node.data?.label || ''}
            onChange={(e) => handleUpdate('label', e.target.value)}
            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            placeholder="e.g., Kitchen GPO"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Circuit ID</label>
          <input
            type="text"
            value={node.data?.circuitId || ''}
            onChange={(e) => handleUpdate('circuitId', e.target.value)}
            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            placeholder="e.g., C1"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Height (mm)</label>
          <input
            type="number"
            value={node.data?.heightMm || ''}
            onChange={(e) => handleUpdate('heightMm', parseInt(e.target.value) || undefined)}
            className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
            placeholder="e.g., 1200"
          />
        </div>

        {/* Device Type Specific Fields */}
        {node.kind === 'power' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Type</label>
            <select
              value={node.data?.powerType || 'single'}
              onChange={(e) => handleUpdate('powerType', e.target.value)}
              className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
            >
              <option value="single">Single GPO</option>
              <option value="double">Double GPO</option>
            </select>
          </div>
        )}

        {node.kind === 'light' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Type</label>
            <select
              value={node.data?.lightType || 'ceiling'}
              onChange={(e) => handleUpdate('lightType', e.target.value)}
              className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
            >
              <option value="ceiling">Ceiling</option>
              <option value="wall">Wall</option>
            </select>
          </div>
        )}

        {node.kind === 'switch' && (
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Type</label>
            <select
              value={node.data?.switchType || '1g'}
              onChange={(e) => handleUpdate('switchType', e.target.value)}
              className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all bg-white"
            >
              <option value="1g">1 Gang</option>
              <option value="2g">2 Gang</option>
              <option value="3g">3 Gang</option>
              <option value="4g">4 Gang</option>
              <option value="dimmer">Dimmer</option>
            </select>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
        <button
          onClick={handleDelete}
          className="flex-1 px-3 py-2 text-sm text-red-600 hover:text-white hover:bg-red-600 border-2 border-red-600 rounded-lg font-medium transition-all"
        >
          Delete
        </button>
        <button
          onClick={onClose}
          className="flex-1 px-3 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium"
        >
          Done
        </button>
      </div>
    </div>
  );
}
