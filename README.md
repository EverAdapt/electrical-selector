# Electrical Floorplan Overlay

A lightweight web app that lets staff upload a floorplan as the background and drag & drop standardized SVG icons (power points, light points, switches) on top—2D-only, simple UX, builder-friendly.

## Why This Exists

Make electrical markups fast and consistent—no CAD expertise required. Upload the plan, place icons, connect where needed, export.

## Features

### Core Features (MVP)
- ✅ **Background floorplan**: Upload image (PNG/JPG) or SVG
- ✅ **Fixed icon set**: Power points (single/double), light points (ceiling/wall), switches (1/2/3 gang, dimmer)
- ✅ **Drag & drop placement**: Intuitive 2D canvas interaction
- ✅ **Snap-to-wall**: Icons automatically snap to nearest wall segments
- ✅ **Device properties**: Label, circuit ID, height, notes per device
- ✅ **Export**: PNG, PDF, and JSON save/load
- ✅ **Undo/Redo**: Full history support with Ctrl+Z/Ctrl+Y

### Coming Soon (Phase 2)
- Multi-page floorplans
- Symbol counts per room/circuit
- Orthogonal wire routing along walls
- Live collaboration
- Role-based sharing

## Tech Stack

- **Frontend**: React + TypeScript + Next.js 16
- **State**: Zustand (lightweight state management)
- **Validation**: Zod
- **Geometry**: @flatten-js/core (projection/distance calculations)
- **Spatial Index**: rbush (fast nearest-wall queries)
- **Export**: pdf-lib (PDF generation)
- **UI**: TailwindCSS + Lucide Icons

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build

```bash
npm run build
npm start
```

## Usage

### 1. Upload a Floorplan
- Click **Upload Floorplan** in the header
- Select an image file (PNG, JPG) or SVG
- The floorplan will appear as the background

### 2. Place Devices
- Select a tool from the **Tool Palette** (left sidebar):
  - Power Point (single/double GPO)
  - Light Point (ceiling/wall)
  - Switch (1/2/3 gang, dimmer)
- Click on the canvas to place a device
- Devices automatically snap to nearby walls

### 3. Edit Device Properties
- Click a device to select it
- Edit properties in the **Properties Panel** (right sidebar):
  - Label
  - Circuit ID
  - Height (mm)
  - Device type variant
  - Notes
- Press Delete or Backspace to remove selected device

### 4. Navigate the Canvas
- **Pan**: Click and drag on empty space
- **Zoom**: Mouse wheel
- **Fit to View**: Button in top-right corner

### 5. Export Your Work
- Click **Export** dropdown in header
- Choose format:
  - **PNG**: Raster image export
  - **PDF**: Vector PDF export
  - **Save Project**: JSON file with all data

### 6. Load a Project
- Click **Load Project**
- Select a previously saved `.json` file
- All devices and settings will be restored

## Keyboard Shortcuts

- **Ctrl+Z** / **Cmd+Z**: Undo
- **Ctrl+Y** / **Cmd+Y** or **Ctrl+Shift+Z**: Redo
- **Delete** / **Backspace**: Delete selected device

## Project Structure

```
electrical-selector/
├── app/
│   └── page.tsx              # Main page component
├── components/
│   ├── Editor.tsx            # SVG editor with zoom/pan
│   ├── DraggableDevice.tsx   # Device node with wall snapping
│   ├── DevicePalette.tsx     # Tool selection palette
│   ├── PropertyPanel.tsx     # Device property editor
│   ├── Wire.tsx              # Edge rendering
│   └── icons/                # SVG icon components
│       ├── power.tsx
│       ├── light.tsx
│       └── switch.tsx
├── lib/
│   ├── types.ts              # TypeScript type definitions
│   ├── store.ts              # Zustand state management
│   ├── snap.ts               # Wall snapping utilities
│   ├── export.ts             # Export functionality
│   └── hooks/
│       └── useDrag.ts        # Drag & drop hook
└── README.md
```

## Data Model

```typescript
type FloorplanDoc = {
  id: string;
  name: string;
  background?: { type: 'svg' | 'image' | 'pdf'; url: string };
  walls?: Array<{ id: string; points: {x: number; y: number}[] }>;
  nodes: Array<{
    id: string;
    kind: 'power' | 'light' | 'switch';
    position: { x: number; y: number };
    rotation?: number;
    data?: {
      label?: string;
      circuitId?: string;
      heightMm?: number;
      notes?: string;
      // Type-specific fields
    };
  }>;
  edges: Array<{
    id: string;
    source: string; // node id
    target: string; // node id
  }>;
  meta?: { grid?: number; units?: 'mm' | 'in'; pxPerMeter?: number };
};
```

## Contributing

This is an internal project. For questions or feature requests, contact the development team.

## License

Proprietary - Internal use only.
