'use client';

import React from 'react';
import { DeviceKind } from '@/lib/types';
import { Dock, DockIcon, DockItem, DockLabel } from '@/components/ui/dock';
import { Lightbulb, ToggleLeft, Plug } from 'lucide-react';

interface PlacementMenuProps {
  position: { x: number; y: number };
  isNearWall: boolean;
  onSelect: (kind: DeviceKind) => void;
  onClose: () => void;
}

export function PlacementMenu({ position, isNearWall, onSelect, onClose }: PlacementMenuProps) {
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Close on Escape
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const items = [
    {
      title: 'Light Point',
      icon: <Lightbulb className="h-full w-full text-yellow-500" />,
      kind: 'light' as DeviceKind,
      show: true,
    },
    {
      title: 'Light Switch',
      icon: <ToggleLeft className="h-full w-full text-blue-500" />,
      kind: 'switch' as DeviceKind,
      show: isNearWall,
    },
    {
      title: 'Power Point',
      icon: <Plug className="h-full w-full text-green-500" />,
      kind: 'power' as DeviceKind,
      show: isNearWall,
    },
  ].filter(item => item.show);

  return (
    <div
      ref={menuRef}
      className="fixed z-50"
      style={{
        left: Math.max(20, Math.min(position.x - 120, window.innerWidth - 280)),
        top: Math.max(20, position.y - 50),
      }}
    >
      <Dock 
        magnification={64}
        distance={100}
      >
        {items.map((item, idx) => (
          <div
            key={idx}
            onClick={() => {
              onSelect(item.kind);
              onClose();
            }}
          >
            <DockItem className="rounded-full bg-gray-800 hover:bg-gray-700 cursor-pointer transition-all duration-150 shadow-xl border-2 border-gray-600/50 hover:border-blue-500/50">
              <DockLabel className="bg-gray-900/95 backdrop-blur-sm border-blue-500/50 text-white font-semibold shadow-xl">
                {item.title}
              </DockLabel>
              <DockIcon className="text-white">{item.icon}</DockIcon>
            </DockItem>
          </div>
        ))}
      </Dock>
    </div>
  );
}
