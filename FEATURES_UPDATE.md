# Features Update - Enhanced UX & Smart Placement

## 🎯 New Features Implemented

### 1. **Enforced Wall Snapping for Power Points**
- ✅ Power points **MUST** be placed on walls
- When placing a power point, it searches within 50px for a wall
- If no wall is found, placement is blocked with an alert
- During dragging, power points are locked to walls and cannot be moved away
- Automatic rotation alignment with wall angle

### 2. **Device Tooltip Modal (Replaces Properties Panel)**
- ✅ New `DeviceTooltip` component - floating modal for device configuration
- Shows automatically when:
  - A new device is placed
  - An existing device is clicked
- Modal features:
  - Label input
  - Circuit ID input
  - Height input (mm)
  - Device-specific type selector (single/double GPO, ceiling/wall light, switch gangs)
  - Delete button
  - Done button to close
- Positioned near the device with smart offset
- Modern gradient styling consistent with the app

### 3. **Auto-Switch Creation for Lights**
- ✅ When placing a light point, a switch is **automatically created**
- Switch placement:
  - Positioned 100px to the right of the light
  - Attempts to snap to nearest wall (50px tolerance)
  - If snapped, aligns with wall angle
  - Defaults to 1-gang switch
- Both devices are independently editable and draggable

### 4. **Curved Dashed Lines (Light-Switch Connection)**
- ✅ Beautiful curved connections between lights and switches
- Quadratic Bezier curve with 20% perpendicular offset
- Distinctive styling:
  - **Blue color (#6366f1)** for light-switch connections
  - **Thicker stroke (2px)** vs regular wires (1.5px)
  - **Longer dashes (6-4)** vs regular wires (4-2)
  - **Higher opacity (0.8)** for better visibility
- Automatically resizes when either device is moved
- Visually distinct from other connection types

### 5. **Selectable Devices with Tooltip**
- ✅ Click any placed device to:
  - Select it (blue ring appears)
  - Show tooltip modal with options
- Click elsewhere or press "Done" to close tooltip
- Properties panel is no longer used for quick edits
- Much faster workflow for editing device properties

## 🎨 Visual Improvements

### Tooltip Modal Design
- Floating card with:
  - Gradient blue icon header
  - Clean form inputs with focus rings
  - Delete button (red outline)
  - Done button (blue gradient)
  - Border with blue accent
  - Shadow for depth

### Wire Styling
- Light-switch wires: Blue, curved, prominent
- Other wires: Gray, dashed, subtle
- Both update in real-time as devices move

## 🔧 Technical Details

### Component Structure
```
DeviceTooltip.tsx - Reusable modal for all device types
├─ Auto-configures fields based on device kind
├─ Handles updates through Zustand store
└─ Positioned absolutely relative to click

Editor.tsx
├─ Manages tooltip state (nodeId, position)
├─ Enforces wall snapping for power points
├─ Auto-creates switches for lights
└─ Creates edges between lights and switches

DraggableDevice.tsx
├─ Shows tooltip on click (via callback)
├─ Enforces wall lock for power points during drag
└─ Allows free movement for lights/switches

Wire.tsx
├─ Detects light-switch connections
├─ Renders curved path using Quadratic Bezier
└─ Applies distinctive styling
```

### Wall Snapping Logic
```typescript
// Power points (enforced)
- Placement tolerance: 50px
- Drag tolerance: 50px (locked)
- Blocks placement if no wall found

// Lights & switches (optional)
- Placement tolerance: 15px
- Drag tolerance: 15px (helpful but not enforced)
- Allows free positioning if no wall nearby
```

### Auto-Switch Logic
```typescript
When placing light:
1. Create light at clicked position
2. Calculate switch position (+100px X offset)
3. Attempt wall snap for switch (50px tolerance)
4. Create switch with 1-gang default
5. Create curved edge connecting them
6. Show tooltip for the light
```

## 📋 User Workflow

### Placing a Power Point
1. Click "Power Point" in palette
2. Click on floorplan **near a wall**
3. If too far from wall → alert shown
4. If on wall → device snaps, tooltip appears
5. Edit properties in tooltip
6. Click "Done" or click elsewhere

### Placing a Light
1. Click "Light Point" in palette
2. Click on floorplan
3. Light appears **with auto-created switch**
4. Curved blue line connects them
5. Tooltip appears for light
6. Can drag either device independently
7. Connection updates automatically

### Editing Existing Devices
1. Click any device on canvas
2. Tooltip appears at cursor
3. Edit properties
4. Click "Done" when finished

## 🚀 Benefits

1. **Faster Workflow**: No need to open properties panel
2. **Enforced Standards**: Power points must be on walls
3. **Automatic Linking**: Lights come with switches pre-connected
4. **Visual Clarity**: Curved blue lines clearly show light-switch pairs
5. **Intuitive UX**: Click device → edit → done

## 🔄 What Changed From Previous Version

### Removed
- ❌ Properties panel auto-opening on device creation
- ❌ Free placement of power points anywhere

### Added
- ✅ Tooltip modal system
- ✅ Wall snapping enforcement for GPOs
- ✅ Auto-switch creation
- ✅ Curved wire rendering
- ✅ Click-to-edit workflow

### Enhanced
- ✨ Wall snapping with separate tolerances per device type
- ✨ Visual feedback (curved wires, blue accent color)
- ✨ Faster property editing

## 🎯 Next Steps (Suggestions)

- [ ] Allow user to drag switch independently while maintaining connection
- [ ] Add visual indicator when power point is too far from wall
- [ ] Support multiple switches per light
- [ ] Add "unlink" button to remove light-switch connection
- [ ] Snap switches to standard height (1100-1200mm) when placed

---

**Version**: 2.0 Enhanced UX  
**Updated**: November 2024
