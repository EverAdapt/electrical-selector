import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DeviceNode, Edge, WallSegment, Background, Meta, ViewportState } from './types';

interface FloorplanState {
  // Document data
  id: string;
  name: string;
  background?: Background;
  walls: WallSegment[];
  nodes: DeviceNode[];
  edges: Edge[];
  meta: Meta;
  
  // UI state
  viewport: ViewportState;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  mode: 'select' | 'add-power' | 'add-light' | 'add-switch' | 'add-wire';
  
  // History
  history: Array<{ nodes: DeviceNode[]; edges: Edge[] }>;
  historyIndex: number;
  
  // Actions - Document
  setBackground: (background: Background) => void;
  setWalls: (walls: WallSegment[]) => void;
  setMeta: (meta: Partial<Meta>) => void;
  
  // Actions - Nodes
  addNode: (node: Omit<DeviceNode, 'id'>) => string;
  updateNode: (id: string, updates: Partial<DeviceNode>) => void;
  deleteNode: (id: string) => void;
  
  // Batch operations
  batchUpdate: (updates: {
    nodesToAdd?: Omit<DeviceNode, 'id'>[];
    nodesToDelete?: string[];
    edgesToAdd?: Omit<Edge, 'id'>[];
    edgesToDelete?: string[];
  }) => void;
  
  // Actions - Edges
  addEdge: (edge: Omit<Edge, 'id'>) => void;
  updateEdge: (id: string, updates: Partial<Edge>) => void;
  deleteEdge: (id: string) => void;
  
  // Actions - Selection
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  
  // Actions - UI
  setMode: (mode: FloorplanState['mode']) => void;
  setViewport: (viewport: Partial<ViewportState>) => void;
  
  // Actions - History
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  
  // Actions - Project
  loadProject: (data: Partial<FloorplanState>) => void;
  exportProject: () => string;
  reset: () => void;
}

const initialState = {
  id: crypto.randomUUID(),
  name: 'Untitled Floorplan',
  walls: [],
  nodes: [],
  edges: [],
  meta: {
    grid: 10,
    units: 'mm' as const,
    pxPerMeter: 100,
  },
  viewport: {
    zoom: 1,
    pan: { x: 0, y: 0 },
  },
  selectedNodeId: null,
  selectedEdgeId: null,
  mode: 'select' as const,
  history: [],
  historyIndex: -1,
};

export const useFloorplanStore = create<FloorplanState>()(
  devtools((set, get) => ({
    ...initialState,
    
    // Document actions
    setBackground: (background) => set({ background }),
    setWalls: (walls) => set({ walls }),
    setMeta: (meta) => set((state) => ({ meta: { ...state.meta, ...meta } })),
    
    // Node actions
    addNode: (node) => {
      const id = crypto.randomUUID();
      const newNode = { ...node, id } as DeviceNode;
      set((state) => ({
        nodes: [...state.nodes, newNode],
        selectedNodeId: id,
      }));
      get().pushHistory();
      return id;
    },
    
    updateNode: (id, updates) => {
      set((state) => ({
        nodes: state.nodes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
      }));
      get().pushHistory();
    },
    
    deleteNode: (id) => {
      set((state) => ({
        nodes: state.nodes.filter((n) => n.id !== id),
        edges: state.edges.filter((e) => e.source !== id && e.target !== id),
        selectedNodeId: state.selectedNodeId === id ? null : state.selectedNodeId,
      }));
      get().pushHistory();
    },
    
    // Edge actions
    addEdge: (edge) => {
      const id = crypto.randomUUID();
      const newEdge = { ...edge, id } as Edge;
      set((state) => ({
        edges: [...state.edges, newEdge],
        selectedEdgeId: id,
      }));
      get().pushHistory();
    },
    
    updateEdge: (id, updates) => {
      set((state) => ({
        edges: state.edges.map((e) => (e.id === id ? { ...e, ...updates } : e)),
      }));
      get().pushHistory();
    },
    
    deleteEdge: (id) => {
      set((state) => ({
        edges: state.edges.filter((e) => e.id !== id),
        selectedEdgeId: state.selectedEdgeId === id ? null : state.selectedEdgeId,
      }));
      get().pushHistory();
    },
    
    // Batch update - atomic operation for multiple changes
    batchUpdate: (updates) => {
      set((state) => {
        let newNodes = [...state.nodes];
        let newEdges = [...state.edges];
        
        // Add new nodes
        if (updates.nodesToAdd) {
          const addedNodes = updates.nodesToAdd.map(node => {
            // Allow passing nodes with ID (for precise control)
            const nodeWithId = node as any;
            const id = nodeWithId.id || crypto.randomUUID();
            return { ...node, id } as DeviceNode;
          });
          newNodes = [...newNodes, ...addedNodes];
        }
        
        // Delete nodes (and their edges)
        if (updates.nodesToDelete) {
          newNodes = newNodes.filter(n => !updates.nodesToDelete!.includes(n.id));
          newEdges = newEdges.filter(e => 
            !updates.nodesToDelete!.includes(e.source) && 
            !updates.nodesToDelete!.includes(e.target)
          );
        }
        
        // Add new edges
        if (updates.edgesToAdd) {
          const addedEdges = updates.edgesToAdd.map(edge => ({
            ...edge,
            id: crypto.randomUUID(),
          } as Edge));
          newEdges = [...newEdges, ...addedEdges];
        }
        
        // Delete edges
        if (updates.edgesToDelete) {
          newEdges = newEdges.filter(e => !updates.edgesToDelete!.includes(e.id));
        }
        
        return { nodes: newNodes, edges: newEdges };
      });
      get().pushHistory();
    },
    
    // Selection actions
    selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
    selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),
    
    // UI actions
    setMode: (mode) => set({ mode }),
    setViewport: (viewport) => set((state) => ({
      viewport: { ...state.viewport, ...viewport },
    })),
    
    // History actions
    pushHistory: () => {
      const { nodes, edges, history, historyIndex } = get();
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
      // Keep history limited to 50 entries
      if (newHistory.length > 50) newHistory.shift();
      set({ history: newHistory, historyIndex: newHistory.length - 1 });
    },
    
    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const prev = history[historyIndex - 1];
        set({ nodes: prev.nodes, edges: prev.edges, historyIndex: historyIndex - 1 });
      }
    },
    
    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const next = history[historyIndex + 1];
        set({ nodes: next.nodes, edges: next.edges, historyIndex: historyIndex + 1 });
      }
    },
    
    // Project actions
    loadProject: (data) => {
      set({
        ...initialState,
        ...data,
        history: [],
        historyIndex: -1,
      });
    },
    
    exportProject: () => {
      const { id, name, background, walls, nodes, edges, meta } = get();
      return JSON.stringify({ id, name, background, walls, nodes, edges, meta }, null, 2);
    },
    
    reset: () => set({
      ...initialState,
      id: crypto.randomUUID(),
    }),
  }))
);
