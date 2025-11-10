'use client';

import React, { useState } from 'react';
import { X, Upload, MousePointer, Zap } from 'lucide-react';

interface WelcomeGuideProps {
  onClose: () => void;
}

export function WelcomeGuide({ onClose }: WelcomeGuideProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 border border-gray-200">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Welcome to Electrical Floorplan Overlay
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <p className="text-gray-600">
            Create professional electrical markups in minutes—no CAD expertise required.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Upload className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">1. Upload Your Floorplan</h3>
                <p className="text-sm text-gray-600">
                  Click "Upload Floorplan" and select an image (PNG, JPG) or SVG file of your floorplan.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <MousePointer className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">2. Select a Tool</h3>
                <p className="text-sm text-gray-600">
                  Choose Power Point, Light Point, or Switch from the left panel, then click to place devices on your plan.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">3. Smart Wall Snapping</h3>
                <p className="text-sm text-gray-600">
                  Devices automatically snap to the nearest wall when placed. Drag them to reposition and they'll snap as you move.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200/50">
            <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Quick Tips
            </h4>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Pan:</strong> Click and drag on empty space</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Zoom:</strong> Use mouse wheel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Edit:</strong> Click a device to edit its properties in the right panel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Undo/Redo:</strong> Use Ctrl+Z / Ctrl+Y (Cmd on Mac)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Delete:</strong> Select a device and press Delete or Backspace</span>
              </li>
            </ul>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              Get Started →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
