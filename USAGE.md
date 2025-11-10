# Electrical Floorplan Overlay - Usage Guide

## Overview

This application allows you to create professional electrical markups by overlaying standardized electrical symbols on floorplan images. No CAD experience required!

## Getting Started

### Initial Setup

1. **Start the application**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

2. **Upload a floorplan**
   - Click "Upload Floorplan" in the top toolbar
   - Select an image file (PNG, JPG) or SVG
   - For testing, you can use the sample floorplan: `public/sample-floorplan.svg`

3. **The interface has three main areas:**
   - **Left Sidebar**: Tool palette and device icons
   - **Center**: Interactive canvas/editor
   - **Right Sidebar**: Properties panel for selected devices

## Placing Devices

### Tool Selection

The left sidebar contains four tools:

1. **Select** (Mouse Pointer Icon)
   - Default mode for selecting and moving devices
   - Click and drag empty space to pan
   - Click devices to select them

2. **Power Point** (Lightning Icon)
   - Single or Double GPO (General Power Outlet)
   - Use for wall outlets and power points

3. **Light Point** (Lightbulb Icon)
   - Ceiling or wall-mounted lights
   - Use for all lighting fixtures

4. **Switch** (Toggle Icon)
   - 1, 2, or 3 gang switches
   - Dimmer option available

### Placing a Device

1. Click a tool in the left sidebar (e.g., "Power Point")
2. Click on the canvas where you want to place the device
3. The device will appear and snap to the nearest wall if within range
4. Repeat to place multiple devices

### Smart Wall Snapping

- When you place or drag a device near a wall, it automatically snaps to the wall
- The snap tolerance is ~15 pixels at current zoom
- Snapped devices also rotate to align with the wall angle
- This ensures consistent, professional-looking placement

## Editing Devices

### Selecting a Device

- Click on any placed device to select it
- Selected devices show a blue ring
- The Properties Panel (right sidebar) updates with device details

### Moving a Device

- Select a device
- Click and drag it to a new location
- It will snap to walls as you move it
- Release to place

### Editing Properties

With a device selected, edit these properties in the right sidebar:

- **Label**: Custom name (e.g., "Kitchen GPO 1")
- **Circuit ID**: Circuit number (e.g., "C1", "C2")
- **Height**: Installation height in millimeters
- **Device Type**: 
  - Power: Single or Double outlet
  - Light: Ceiling or Wall mounted
  - Switch: 1/2/3 Gang or Dimmer
- **Notes**: Additional information

### Deleting a Device

- Select the device
- Press **Delete** or **Backspace** key
- Or click "Delete" button in Properties Panel

## Canvas Navigation

### Pan (Move the View)

- **Mouse**: Click and drag on empty space
- Works in "Select" mode only
- Hold and drag to move the entire view

### Zoom

- **Mouse Wheel**: Scroll up to zoom in, down to zoom out
- Zoom range: 10% to 500%
- Current zoom level shown in top-right corner

### Fit to View

- Click the "Fit to View" button (top-right)
- Resets zoom to 100% and centers the view

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| **Ctrl+Z** (Cmd+Z on Mac) | Undo last action |
| **Ctrl+Y** (Cmd+Y on Mac) | Redo last undone action |
| **Delete** or **Backspace** | Delete selected device |
| **Mouse Wheel** | Zoom in/out |

## Exporting Your Work

Click the **Export** button in the top toolbar to access export options:

### Export PNG

- Creates a high-quality raster image
- Good for: Printing, email attachments, presentations
- Resolution: 2x for crisp output
- File extension: `.png`

### Export PDF

- Creates a vector PDF document
- Good for: Professional documentation, scalable printing
- Maintains quality at any size
- File extension: `.pdf`

### Save Project

- Saves the complete project as JSON
- Includes: All devices, properties, background, settings
- Good for: Continuing work later, version control
- File extension: `.json`

## Loading a Saved Project

1. Click **Load Project** in the top toolbar
2. Select a previously saved `.json` file
3. The project loads with all devices and settings restored

## Tips & Best Practices

### Workflow Recommendations

1. **Start with a good floorplan**
   - Use a clear, high-resolution image
   - Ensure walls are visible and straight
   - SVG files work best for wall detection

2. **Work methodically**
   - Complete one room at a time
   - Use consistent labeling (e.g., "LR" for Living Room)
   - Assign circuit IDs as you go

3. **Use the properties panel**
   - Label all devices clearly
   - Add circuit IDs for electrical documentation
   - Note heights for installation guidance

4. **Save frequently**
   - Use "Save Project" to create backups
   - Name files descriptively (e.g., `house-main-floor-v1.json`)

### Device Placement Tips

- **Power Points**: Typically 300-450mm above floor
- **Light Switches**: Usually 1100-1200mm above floor
- **Ceiling Lights**: Center of room or over key areas
- **Wall Lights**: 1500-1800mm above floor

### Canvas Management

- **Zoom in** for precise placement
- **Zoom out** for overall view
- Use **pan** to navigate large floorplans
- **Fit to View** to reset if you get lost

## Troubleshooting

### Device won't snap to wall

- The floorplan may not have recognizable walls
- Try placing the device manually
- Use an SVG floorplan with defined lines/paths for best results

### Can't see my uploaded floorplan

- Check file format (PNG, JPG, or SVG supported)
- Try a different image
- Ensure image is not corrupted

### Undo/Redo not working

- History is limited to 50 actions
- Ensure you're using the correct keyboard shortcuts
- Try the Undo/Redo buttons in the toolbar

### Export not working

- Ensure you have devices placed
- Check browser console for errors
- Try a different export format

## Advanced Features (Coming Soon)

- **Multi-page projects**: Handle multiple floors
- **Wire routing**: Connect devices with intelligent wire paths
- **BOM generation**: Automatic bill of materials
- **Collaboration**: Real-time multi-user editing
- **Templates**: Pre-made device layouts for common rooms

## Support

For issues, questions, or feature requests, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: November 2024
