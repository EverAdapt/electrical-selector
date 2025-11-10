# Improvements V2 - Enhanced Snapping & Interaction

## ✅ Changes Implemented

### 1. **Intelligent Wall Snapping (No More Warnings)**
- **Power Points**: Automatically snap to nearest wall within **200px tolerance**
- Falls back to **500px tolerance** if no wall found within 200px
- **No more alerts** - always finds a wall within a room
- Smooth, automatic placement on walls

### 2. **Switches Always Snap to Walls**
- Switches now behave like power points
- **200px tolerance** for wall snapping (500px fallback)
- Auto-created switches (from lights) use same large tolerance
- Enforced during drag - switches stay on walls

### 3. **Click on Existing Device Opens Tooltip**
- **ANY tool selected** - clicking near a device (30px) opens its tooltip
- User intention recognition:
  - Click near device → Edit that device
  - Click empty space → Add new device
- Works with all tools (Power, Light, Switch, Select)
- Seamless workflow between adding and editing

### 4. **Tooltip Follows During Drag**
- Tooltip stays visible and follows the device as you drag
- Updates position in real-time
- Works for all device types
- Smooth tracking using SVG coordinate transformation

### 5. **Thicker Dashed Lines (Light-Switch)**
- Increased from 2px to **3px thickness**
- More visible and prominent
- Dash pattern adjusted to **8-6** (was 6-4)
- Beautiful curved blue lines clearly show connections

## 🎨 Visual Improvements

### Wire Styling (Light-Switch)
- **Thickness**: 3px (was 2px)
- **Color**: Blue (#6366f1)
- **Dash Pattern**: 8-6 (longer dashes)
- **Curve**: Quadratic Bezier with 20% offset
- **Opacity**: 0.8

### Snapping Behavior
| Device | Placement Tolerance | Drag Tolerance | Enforced |
|--------|-------------------|----------------|----------|
| Power Point | 200px → 500px | 200px → 500px | ✅ Yes |
| Switch | 200px → 500px | 200px → 500px | ✅ Yes |
| Light | 15px | 15px | ❌ No (optional) |

## 🔧 Technical Changes

### Editor.tsx
```typescript
// Click handling priority:
1. Check if clicking near existing device (30px)
   → Open tooltip for that device
2. If not near device and tool selected
   → Add new device
3. If in select mode
   → Just deselect
```

### DraggableDevice.tsx
```typescript
// Enhanced drag behavior:
- onStart: Show tooltip
- onMove: 
  - Power/Switch: Enforce wall snap (200px → 500px)
  - Light: Optional snap (15px)
  - Update tooltip position during drag
```

### Wire.tsx
```typescript
// Light-Switch detection and styling:
- Detect if edge connects light ↔ switch
- Render curved Bezier path
- Apply 3px stroke, blue color, 8-6 dashes
```

## 📋 User Workflows

### Adding a Power Point
1. Click "Power Point" in palette
2. Click **anywhere** on floorplan
3. Device snaps to nearest wall automatically (up to 500px away)
4. Tooltip appears - edit properties
5. Click "Done" or start dragging

### Adding a Light
1. Click "Light Point" in palette
2. Click anywhere on floorplan
3. Light appears **+ switch auto-created on wall**
4. Both connected with **thick blue curved line**
5. Tooltip appears for light
6. Both devices draggable independently

### Editing an Existing Device
1. Click near any device (even with other tools selected)
2. Tooltip opens immediately
3. Edit properties
4. **Drag while tooltip is open** - tooltip follows
5. Click "Done" when finished

### Moving a Power Point/Switch
1. Click and drag the device
2. Device snaps to nearest wall (200-500px)
3. Cannot be moved away from walls
4. Tooltip follows if open
5. Release to place

## 🎯 Smart Behaviors

### Click Intention Detection
- **Near device (< 30px)**: Edit existing device
- **Empty space**: Add new device (if tool selected)
- Works regardless of tool selection

### Wall Snapping Priority
1. Try 200px tolerance first
2. If no wall found, try 500px
3. Always finds a wall in normal rooms
4. No user warnings needed

### Tooltip Following
- Tracks device during drag
- SVG-to-screen coordinate transformation
- Smooth real-time updates
- Doesn't interfere with dragging

## 🐛 Edge Cases Handled

- ✅ Clicking device with different tool selected → Opens tooltip
- ✅ Dragging while tooltip open → Tooltip follows
- ✅ Starting pan in select mode → Closes tooltip
- ✅ Large rooms → 500px fallback tolerance
- ✅ Multiple devices close together → 30px click detection

## 🚀 Benefits

1. **No More Warnings**: Power points always find a wall
2. **Faster Editing**: Click device to edit instantly
3. **Visual Clarity**: 3px thick blue lines for light-switch
4. **Consistent Behavior**: Switches snap like power points
5. **Intuitive Workflow**: Tooltip follows during drag

## 📊 Performance

- Wall snapping uses rbush spatial index (O(log n))
- 200px-500px tolerance covers typical rooms
- Click detection is simple distance check
- Tooltip updates throttled by drag events
- No performance impact

---

**Version**: 2.1 Enhanced UX  
**Updated**: November 2024  
**Status**: ✅ Ready for Testing
