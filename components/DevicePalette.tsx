'use client';

import React from 'react';
import { useFloorplanStore } from '@/lib/store';
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
import { MousePointer2, Zap, Lightbulb, ToggleLeft } from 'lucide-react';

export function DevicePalette() {
  const mode = useFloorplanStore((s) => s.mode);
  const setMode = useFloorplanStore((s) => s.setMode);
  const nodes = useFloorplanStore((s) => s.nodes);

  // Count devices by type
  const counts = {
    power: nodes.filter((n) => n.kind === 'power').length,
    light: nodes.filter((n) => n.kind === 'light').length,
    switch: nodes.filter((n) => n.kind === 'switch').length,
  };

  const tools = [
    { id: 'select', label: 'Select', icon: MousePointer2, count: undefined },
    { id: 'add-power', label: 'Power Point', icon: Zap, count: counts.power },
    { id: 'add-light', label: 'Light Point', icon: Lightbulb, count: counts.light },
    { id: 'add-switch', label: 'Switch', icon: ToggleLeft, count: counts.switch },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <MousePointer2 size={16} className="text-white" />
        </div>
        <h3 className="font-bold text-lg text-gray-900">Tool Palette</h3>
      </div>
      
      <div className="space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setMode(tool.id as any)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium ${
              mode === tool.id
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-[1.02]'
                : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-blue-100 text-gray-700 hover:shadow-md'
            }`}
          >
            <div className="flex items-center gap-3">
              <tool.icon size={20} />
              <span className="text-sm">{tool.label}</span>
            </div>
            {tool.count !== undefined && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                mode === tool.id
                  ? 'bg-white/20 text-white'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {tool.count}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-5 mt-5">
        <h4 className="font-bold text-sm text-gray-900 mb-3">Device Library</h4>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-orange-200/50 hover:shadow-md transition-all">
            <IconPowerSingle width={28} height={28} className="mx-auto text-orange-700" />
            <span className="text-xs font-medium text-gray-700 mt-1.5 block">Single GPO</span>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg border border-orange-200/50 hover:shadow-md transition-all">
            <IconPowerDouble width={28} height={28} className="mx-auto text-orange-700" />
            <span className="text-xs font-medium text-gray-700 mt-1.5 block">Double GPO</span>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200/50 hover:shadow-md transition-all">
            <IconLightCeiling width={28} height={28} className="mx-auto text-yellow-700" />
            <span className="text-xs font-medium text-gray-700 mt-1.5 block">Ceiling</span>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-yellow-200/50 hover:shadow-md transition-all">
            <IconLightWall width={28} height={28} className="mx-auto text-yellow-700" />
            <span className="text-xs font-medium text-gray-700 mt-1.5 block">Wall</span>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg border border-slate-200/50 hover:shadow-md transition-all">
            <IconSwitch1Gang width={28} height={28} className="mx-auto text-slate-700" />
            <span className="text-xs font-medium text-gray-700 mt-1.5 block">1 Gang</span>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg border border-slate-200/50 hover:shadow-md transition-all">
            <IconSwitch2Gang width={28} height={28} className="mx-auto text-slate-700" />
            <span className="text-xs font-medium text-gray-700 mt-1.5 block">2 Gang</span>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg border border-slate-200/50 hover:shadow-md transition-all">
            <IconSwitch3Gang width={28} height={28} className="mx-auto text-slate-700" />
            <span className="text-xs font-medium text-gray-700 mt-1.5 block">3 Gang</span>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg border border-slate-200/50 hover:shadow-md transition-all">
            <IconSwitchDimmer width={28} height={28} className="mx-auto text-slate-700" />
            <span className="text-xs font-medium text-gray-700 mt-1.5 block">Dimmer</span>
          </div>
        </div>
      </div>
    </div>
  );
}
