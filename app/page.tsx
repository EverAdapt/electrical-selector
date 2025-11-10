'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@/components/Editor';
import { DevicePalette } from '@/components/DevicePalette';
import { PropertyPanel } from '@/components/PropertyPanel';
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
      
      <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/50 px-8 py-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Electrical Floorplan Overlay
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">Professional electrical markup made simple</p>
            </div>
          </div>
        
        <div className="flex items-center gap-3">
            <button
              onClick={undo}
              className="p-2.5 hover:bg-blue-50 rounded-lg transition-all hover:shadow-sm"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={20} className="text-gray-700" />
            </button>
            <button
              onClick={redo}
              className="p-2.5 hover:bg-blue-50 rounded-lg transition-all hover:shadow-sm"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={20} className="text-gray-700" />
            </button>
            
            <div className="w-px h-8 bg-gray-300" />
            
            <button
              onClick={handleLoadSample}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Try Sample</span>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 hover:border-blue-500 rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              <Upload size={18} className="text-gray-700" />
              <span className="text-sm font-medium text-gray-700">Upload Plan</span>
            </button>
            
            <button
              onClick={() => jsonInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-gray-300 hover:border-blue-500 rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              <FileJson size={18} className="text-gray-700" />
              <span className="text-sm font-medium text-gray-700">Load Project</span>
            </button>
            
            <div className="relative group">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium">
                <Download size={18} />
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
      <div className="flex-1 flex overflow-hidden gap-4 p-4">
        {/* Left sidebar - Palette */}
        <aside className="w-72 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-5 overflow-y-auto">
          <DevicePalette />
        </aside>

        {/* Center - Editor */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full bg-white rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden relative">
            <Editor />
          </div>
        </main>

        {/* Right sidebar - Properties */}
        <aside className="w-72 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 p-5 overflow-y-auto">
          <PropertyPanel />
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
