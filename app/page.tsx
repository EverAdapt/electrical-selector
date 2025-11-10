'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@/components/Editor';
import { Legend } from '@/components/Legend';
import { WelcomeGuide } from '@/components/WelcomeGuide';
import { useFloorplanStore } from '@/lib/store';
import { exportAsPNG, exportAsPDF, downloadJSON, loadJSONFile, loadImageFile } from '@/lib/export';
import { parseSVGWalls } from '@/lib/snap';
import { Download, Upload, Save, FileJson, Image as ImageIcon, FileText, Undo2, Redo2 } from 'lucide-react';

export default function Home() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  
  const name = useFloorplanStore((s) => s.name);
  const exportProject = useFloorplanStore((s) => s.exportProject);
  const loadProject = useFloorplanStore((s) => s.loadProject);
  const setBackground = useFloorplanStore((s) => s.setBackground);
  const setWalls = useFloorplanStore((s) => s.setWalls);
  const reset = useFloorplanStore((s) => s.reset);
  const undo = useFloorplanStore((s) => s.undo);
  const redo = useFloorplanStore((s) => s.redo);

  // Handle background image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await loadImageFile(file);
      setBackground({
        type: 'image',
        url: dataUrl,
      });
    } catch (error) {
      console.error('Error loading image:', error);
      alert('Failed to load image');
    }
  };

  // Load sample floorplan
  const handleLoadSample = async () => {
    try {
      const response = await fetch('/sample-floorplan.svg');
      const svgText = await response.text();
      const blob = new Blob([svgText], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      
      setBackground({
        type: 'svg',
        url: url,
      });
      
      // Parse walls from the SVG
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
      const svgElement = svgDoc.documentElement as unknown as SVGSVGElement;
      const parsedWalls = parseSVGWalls(svgElement);
      setWalls(parsedWalls);
    } catch (error) {
      console.error('Error loading sample:', error);
      alert('Failed to load sample floorplan');
    }
  };

  // Handle JSON project load
  const handleJSONLoad = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await loadJSONFile(file);
      loadProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
      alert('Failed to load project file');
    }
  };

  // Export handlers
  const handleExportPNG = async () => {
    const svg = document.querySelector('#editor-svg') as SVGSVGElement;
    if (!svg) return;

    setIsExporting(true);
    try {
      await exportAsPNG(svg, `${name}.png`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export PNG');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    const svg = document.querySelector('#editor-svg') as SVGSVGElement;
    if (!svg) return;

    setIsExporting(true);
    try {
      await exportAsPDF(svg, `${name}.pdf`);
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = () => {
    const json = exportProject();
    downloadJSON(json, `${name}.json`);
  };

  // Auto-load sample for dev/testing
  useEffect(() => {
    handleLoadSample();
  }, []);
  
  // Show welcome guide on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedElectricalOverlay');
    if (!hasVisited) {
      setShowWelcome(true);
      localStorage.setItem('hasVisitedElectricalOverlay', 'true');
    }
  }, []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <>
      {showWelcome && <WelcomeGuide onClose={() => setShowWelcome(false)} />}
      
      <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 font-inter">
      {/* Header */}
      <header className="bg-gray-900/90 backdrop-blur-lg border-b border-gray-700/50 px-8 py-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg ring-2 ring-blue-400/20">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Electrical Floorplan Overlay
              </h1>
              <p className="text-sm text-gray-400 mt-0.5 font-medium">Professional electrical markup made simple</p>
            </div>
          </div>
        
        <div className="flex items-center gap-2.5">
            <button
              onClick={undo}
              className="h-10 px-3 hover:bg-gray-800 rounded-xl transition-all border border-gray-700 hover:border-gray-600 flex items-center justify-center"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={18} className="text-gray-300" />
            </button>
            <button
              onClick={redo}
              className="h-10 px-3 hover:bg-gray-800 rounded-xl transition-all border border-gray-700 hover:border-gray-600 flex items-center justify-center"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={18} className="text-gray-300" />
            </button>
            
            <div className="w-px h-8 bg-gray-700 mx-1" />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="h-10 flex items-center gap-2 px-4 bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-xl transition-all hover:bg-gray-750"
            >
              <Upload size={16} className="text-gray-300" />
              <span className="text-sm font-semibold text-gray-300">Upload</span>
            </button>
            
            <button
              onClick={() => jsonInputRef.current?.click()}
              className="h-10 flex items-center gap-2 px-4 bg-gray-800 border border-gray-700 hover:border-blue-500 rounded-xl transition-all hover:bg-gray-750"
            >
              <FileJson size={16} className="text-gray-300" />
              <span className="text-sm font-semibold text-gray-300">Load</span>
            </button>
            
            <div className="relative group">
              <button className="h-10 flex items-center gap-2 px-5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg hover:shadow-xl font-semibold">
                <Download size={16} />
                <span className="text-sm">Export</span>
              </button>
            <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 min-w-[160px]">
              <button
                onClick={handleExportPNG}
                disabled={isExporting}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-left"
              >
                <ImageIcon size={16} />
                Export PNG
              </button>
              <button
                onClick={handleExportPDF}
                disabled={isExporting}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-left"
              >
                <FileText size={16} />
                Export PDF
              </button>
              <button
                onClick={handleExportJSON}
                className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-sm text-left"
              >
                <Save size={16} />
                Save Project
              </button>
            </div>
          </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden gap-3 p-3">
        {/* Center - Editor */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full bg-gray-100 rounded-xl shadow-2xl border border-gray-700/30 overflow-hidden relative">
            <Editor />
          </div>
        </main>
        
        {/* Right - Legend */}
        <aside className="w-80 flex-shrink-0">
          <div className="h-full overflow-y-auto">
            <Legend />
          </div>
        </aside>
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        ref={jsonInputRef}
        type="file"
        accept=".json"
        onChange={handleJSONLoad}
        className="hidden"
      />
    </div>
    </>
  );
}
