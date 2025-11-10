# Quick Start Guide

## Running the Application

The dev server is waiting for your confirmation. To start:

1. **Open a terminal** in the project directory:
   ```
   c:\Users\diego\source\repos\electrical-selector
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```
   
   When prompted, press **R** (Run once) to start the server.

3. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## First Steps

1. **Welcome Screen**: On first visit, you'll see a welcome guide explaining the basics.

2. **Upload a Floorplan**: 
   - Click "Upload Floorplan" in the header
   - Try the sample: `public/sample-floorplan.svg`
   - Or use your own PNG/JPG/SVG floorplan

3. **Place Devices**:
   - Select "Power Point", "Light Point", or "Switch" from the left sidebar
   - Click on the canvas to place devices
   - Devices will automatically snap to nearby walls!

4. **Edit Properties**:
   - Click any device to select it
   - Edit label, circuit ID, height, and notes in the right sidebar
   - Change device types (single/double GPO, ceiling/wall lights, etc.)

5. **Export**:
   - PNG: For sharing and printing
   - PDF: For professional documentation
   - Save Project: To continue work later

## What's Been Built

✅ **Complete MVP Application** with all requested features:
- SVG-based editor with zoom & pan
- Drag & drop electrical symbols (power, light, switch)
- Smart wall snapping using rbush + flatten-js
- Device properties panel (label, circuit, height, notes)
- Export to PNG, PDF, and JSON
- Full undo/redo support
- Professional UI with TailwindCSS + Lucide icons
- Welcome guide for new users
- Sample floorplan for testing

## Project Structure

```
electrical-selector/
├── app/page.tsx                 # Main application page
├── components/
│   ├── Editor.tsx              # SVG canvas with zoom/pan
│   ├── DraggableDevice.tsx     # Snappable device nodes
│   ├── DevicePalette.tsx       # Tool selection
│   ├── PropertyPanel.tsx       # Device editor
│   ├── WelcomeGuide.tsx        # First-visit guide
│   ├── Wire.tsx                # Connection rendering
│   └── icons/                  # SVG electrical symbols
├── lib/
│   ├── store.ts                # Zustand state management
│   ├── types.ts                # TypeScript definitions
│   ├── snap.ts                 # Wall snapping logic
│   ├── export.ts               # PNG/PDF/JSON export
│   └── hooks/useDrag.ts        # Drag & drop utility
├── public/
│   └── sample-floorplan.svg    # Test floorplan
├── README.md                    # Full documentation
├── USAGE.md                     # Detailed usage guide
└── package.json                 # Dependencies
```

## Tech Stack

- **Next.js 16** with App Router
- **React + TypeScript**
- **Zustand** for state management
- **Zod** for validation
- **@flatten-js/core** for geometry calculations
- **rbush** for spatial indexing (fast wall queries)
- **pdf-lib** for PDF export
- **TailwindCSS** for styling
- **Lucide React** for icons

## Features Implemented

### Core Features (MVP)
- ✅ Background floorplan upload (SVG/PNG/JPG)
- ✅ Fixed icon set with variants
- ✅ Drag & drop placement
- ✅ Wall snapping with 15px tolerance
- ✅ Device properties (label, circuit, height, notes, type)
- ✅ Export to PNG, PDF, JSON
- ✅ Project save/load
- ✅ Undo/Redo (50 action history)
- ✅ Keyboard shortcuts
- ✅ Professional UI/UX

### Bonus Features
- ✅ Welcome guide for new users
- ✅ Device count badges in palette
- ✅ Selection highlights
- ✅ Type-specific icons (1/2/3 gang, single/double, etc.)
- ✅ Grid overlay
- ✅ Zoom controls with fit-to-view
- ✅ Sample floorplan for testing

## Known Limitations (Future Enhancements)

The following are documented for Phase 2:
- Multi-page floorplans
- Symbol counts per room/circuit
- Orthogonal wire routing along walls
- Live collaboration
- Role-based sharing

## Testing

1. Start the dev server: `npm run dev`
2. Upload `public/sample-floorplan.svg`
3. Place devices in each room
4. Test wall snapping by dragging devices near walls
5. Edit device properties
6. Test undo/redo
7. Export to PNG/PDF
8. Save project and reload

## Deployment

For production deployment:

```bash
npm run build
npm start
```

Or deploy to Vercel/Netlify using their respective CLIs.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Need Help?

- See `README.md` for complete documentation
- See `USAGE.md` for detailed usage instructions
- Check browser console for any errors

---

**Ready to build!** Run `npm run dev` and start creating electrical markups! 🚀
