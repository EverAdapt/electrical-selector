'use client';

import React, { useMemo } from 'react';
import { useFloorplanStore } from '@/lib/store';
import {
  IconPowerSingle,
  IconPowerDouble,
  IconLightCeiling,
  IconLightWall,
  IconSwitch1Gang,
  IconSwitch2Gang,
  IconSwitch3Gang,
  IconSwitch4Gang,
  IconSwitchDimmer,
} from './icons';

interface DeviceCount {
  icon: React.ReactNode;
  label: string;
  count: number;
}

export function Legend() {
  const nodes = useFloorplanStore((s) => s.nodes);

  const deviceCounts = useMemo(() => {
    const counts: Record<string, DeviceCount> = {
      'power-single': {
        icon: <IconPowerSingle />,
        label: 'Single Power Point',
        count: 0,
      },
      'power-double': {
        icon: <IconPowerDouble />,
        label: 'Double Power Point',
        count: 0,
      },
      'light-ceiling': {
        icon: <IconLightCeiling />,
        label: 'Ceiling Light',
        count: 0,
      },
      'light-wall': {
        icon: <IconLightWall />,
        label: 'Wall Light',
        count: 0,
      },
      'switch-1g': {
        icon: <IconSwitch1Gang />,
        label: '1 Gang Switch',
        count: 0,
      },
      'switch-2g': {
        icon: <IconSwitch2Gang />,
        label: '2 Gang Switch',
        count: 0,
      },
      'switch-3g': {
        icon: <IconSwitch3Gang />,
        label: '3 Gang Switch',
        count: 0,
      },
      'switch-4g': {
        icon: <IconSwitch4Gang />,
        label: '4 Gang Switch',
        count: 0,
      },
      'switch-dimmer': {
        icon: <IconSwitchDimmer />,
        label: 'Dimmer Switch',
        count: 0,
      },
    };

    nodes.forEach((node) => {
      if (node.kind === 'power') {
        const powerType = node.data?.powerType || 'single';
        counts[`power-${powerType}`].count++;
      } else if (node.kind === 'light') {
        const lightType = node.data?.lightType || 'ceiling';
        counts[`light-${lightType}`].count++;
      } else if (node.kind === 'switch') {
        const switchType = node.data?.switchType || '1g';
        counts[`switch-${switchType}`].count++;
      }
    });

    return counts;
  }, [nodes]);

  const totalDevices = Object.values(deviceCounts).reduce((sum, item) => sum + item.count, 0);

  const powerCounts = [deviceCounts['power-single'], deviceCounts['power-double']].filter(item => item.count > 0);
  const lightCounts = [deviceCounts['light-ceiling'], deviceCounts['light-wall']].filter(item => item.count > 0);
  const switchCounts = [
    deviceCounts['switch-1g'],
    deviceCounts['switch-2g'],
    deviceCounts['switch-3g'],
    deviceCounts['switch-4g'],
    deviceCounts['switch-dimmer']
  ].filter(item => item.count > 0);

  return (
    <div 
      className="pointer-events-auto bg-gray-900 backdrop-blur-md rounded-xl shadow-2xl border-2 border-blue-500/30 p-4 h-full overflow-y-auto"
    >
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
        <h3 className="text-sm font-bold text-white">Device Legend</h3>
        <span className="text-xs font-semibold text-blue-400 bg-blue-500/20 px-2 py-1 rounded-full">
          {totalDevices} Total
        </span>
      </div>
      
      {totalDevices === 0 ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gray-800 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-xs text-gray-300 font-medium">No devices placed</p>
          <p className="text-xs text-gray-500 mt-1">Click the floorplan to add</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Power Points */}
          {powerCounts.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center text-green-400 text-[10px] font-bold">
                  {powerCounts.reduce((sum, item) => sum + item.count, 0)}
                </span>
                Power Points
              </h4>
              <div className="space-y-2">
                {powerCounts.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 flex items-center justify-center bg-gray-700 rounded">
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          {item.icon}
                        </svg>
                      </div>
                      <span className="text-xs text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-green-400 min-w-[24px] text-right">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lights */}
          {lightCounts.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-yellow-500/20 flex items-center justify-center text-yellow-400 text-[10px] font-bold">
                  {lightCounts.reduce((sum, item) => sum + item.count, 0)}
                </span>
                Lights
              </h4>
              <div className="space-y-2">
                {lightCounts.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 flex items-center justify-center bg-gray-700 rounded">
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          {item.icon}
                        </svg>
                      </div>
                      <span className="text-xs text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-yellow-400 min-w-[24px] text-right">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Switches */}
          {switchCounts.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-blue-400 mb-2 flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center text-blue-400 text-[10px] font-bold">
                  {switchCounts.reduce((sum, item) => sum + item.count, 0)}
                </span>
                Switches
              </h4>
              <div className="space-y-2">
                {switchCounts.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 flex items-center justify-center bg-gray-700 rounded">
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          {item.icon}
                        </svg>
                      </div>
                      <span className="text-xs text-gray-300">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-blue-400 min-w-[24px] text-right">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
