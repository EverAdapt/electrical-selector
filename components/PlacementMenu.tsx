'use client';

import React from 'react';
import { DeviceKind } from '@/lib/types';

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

  return (
    <div
      ref={menuRef}
      className="absolute bg-white rounded-lg shadow-2xl border-2 border-blue-500 p-2 z-50"
      style={{
        left: position.x,
        top: position.y,
        minWidth: '180px',
      }}
    >
      <div className="text-xs font-semibold text-gray-500 mb-2 px-2">
        {isNearWall ? 'Near Wall' : 'Open Space'}
      </div>
      
      <div className="space-y-1">
        <button
          onClick={() => onSelect('light')}
          className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 flex items-center gap-2 transition-colors"
        >
          <span className="text-2xl">💡</span>
          <div>
            <div className="font-semibold text-sm">Light Point</div>
            <div className="text-xs text-gray-500">Auto-creates switch</div>
          </div>
        </button>

        {isNearWall && (
          <>
            <button
              onClick={() => onSelect('switch')}
              className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 flex items-center gap-2 transition-colors"
            >
              <span className="text-2xl">🔘</span>
              <div>
                <div className="font-semibold text-sm">Light Switch</div>
                <div className="text-xs text-gray-500">Auto-creates light</div>
              </div>
            </button>

            <button
              onClick={() => onSelect('power')}
              className="w-full text-left px-3 py-2 rounded hover:bg-blue-50 flex items-center gap-2 transition-colors"
            >
              <span className="text-2xl">🔌</span>
              <div>
                <div className="font-semibold text-sm">Power Point</div>
                <div className="text-xs text-gray-500">Wall outlet</div>
              </div>
            </button>
          </>
        )}
      </div>

      <div className="text-xs text-gray-400 mt-2 px-2 border-t pt-2">
        Click an option or press Esc to cancel
      </div>
    </div>
  );
}
