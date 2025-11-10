# Enhanced Dragging Features

## ✅ Dragging Behavior Implemented

### 🎯 **Power Points & Switches - Wall-Constrained Dragging**
- **Always snapped to walls** during drag
- **200-500px tolerance** - finds nearest wall automatically
- Cannot be moved away from walls
- Auto-rotates to align with wall angle
- Visual feedback during drag:
  - **Animated pulsing ring** (blue)
  - **Red dashed line** showing wall constraint
  - **"WALL ONLY" label** above device
  - **70% opacity** while dragging

### 💡 **Lights - Free Dragging**
- **Unrestricted movement** anywhere on canvas
- Optional snap to walls (15px tolerance)
- Can be positioned freely for ceiling lights
- Visual feedback during drag:
  - **Animated pulsing ring** (green)
  - **"FREE DRAG" label** above device
  - **70% opacity** while dragging

## 🎨 Visual Feedback

### During Drag State
All devices show clear visual indicators when being dragged:

#### Power Points & Switches
```
┌─────────────────────┐
│   WALL ONLY (red)   │
│                     │
│    ⟨animated⟩      │
│   ◯ ━━━━━━━━ ◯     │ ← Red dashed line
│     [ICON]          │ ← 70% opacity
│    ⟨pulsing⟩       │ ← Blue ring
│                     │
└─────────────────────┘
```

#### Lights
```
┌─────────────────────┐
│  FREE DRAG (green)  │
│                     │
│    ⟨animated⟩      │
│       ◯             │
│     [ICON]          │ ← 70% opacity
│    ⟨pulsing⟩       │ ← Green ring
│                     │
└─────────────────────┘
```

### Animation Effects
- **Pulsing ring**: Expands from radius 24→28px in 1 second loop
- **Dashed pattern**: 4-4 dash array on ring
- **Color coding**: 
  - Blue (#3b82f6) for power/switch
  - Green (#10b981) for lights
  - Red (#ef4444) for wall constraint line

## 📋 User Experience

### Starting a Drag
1. **Click and hold** on any placed device
2. Visual feedback appears immediately:
   - Device becomes 70% transparent
   - Animated ring appears
   - Constraint indicator shows
   - Tooltip appears (if not already open)

### During Drag
#### Power Point/Switch
- Device **snaps to nearest wall** (200-500px range)
- Red "WALL ONLY" label reminds user of constraint
- Cannot move to empty space
- Smooth gliding along walls

#### Light
- Device follows mouse **freely**
- Green "FREE DRAG" label shows freedom
- Can be positioned anywhere
- Optional wall snap if mouse is near wall (15px)

### Ending Drag
1. **Release mouse button**
2. Visual feedback disappears
3. Device opacity returns to 100%
4. Final position is set
5. Tooltip remains open for quick edits

## 🔧 Technical Implementation

### State Management
```typescript
const [isDragging, setIsDragging] = useState(false);

useDrag({
  onStart: () => {
    setIsDragging(true);
    // Show tooltip
  },
  onMove: (pt) => {
    // Apply constraints based on device type
    // Update tooltip position
  },
  onEnd: () => {
    setIsDragging(false);
  }
});
```

### Constraint Logic
```typescript
// Power points & switches
if (node.kind === 'power' || node.kind === 'switch') {
  const snap = snapToWalls(wallIndex, pt.x, pt.y, 200);
  if (!snap) {
    const largeSnap = snapToWalls(wallIndex, pt.x, pt.y, 500);
    // Use largeSnap if found
  }
  // ONLY update if wall found
}

// Lights
if (node.kind === 'light') {
  const snap = snapToWalls(wallIndex, pt.x, pt.y, 15);
  if (snap) {
    // Use snap position
  } else {
    // Allow free position
  }
}
```

### Visual Feedback Components
```typescript
{isDragging && (
  <>
    {/* Animated ring */}
    <circle r={24} stroke={color} strokeDasharray="4 4">
      <animate attributeName="r" from="24" to="28" dur="1s" repeatCount="indefinite" />
    </circle>
    
    {/* Constraint indicators */}
    {(power || switch) && <WallConstraintIndicator />}
    {light && <FreeDragIndicator />}
  </>
)}
```

## 🎯 Smart Behaviors

### Click vs Drag Detection
- **Click (< 100ms, < 5px movement)**: Opens tooltip
- **Drag (> 100ms or > 5px movement)**: Initiates drag with visual feedback

### Tooltip Following
- Tooltip tracks device position during drag
- SVG coordinates transformed to screen coordinates
- Smooth updates every frame

### Edge Updates
- Light-switch connections update in real-time
- Curved lines recalculate as devices move
- 3px blue dashed lines remain visible during drag

## 🎨 Color Coding System

| Device Type | Ring Color | Constraint Color | Label Color | Meaning |
|-------------|-----------|------------------|-------------|---------|
| Power Point | Blue (#3b82f6) | Red (#ef4444) | Red | Wall-locked |
| Switch | Blue (#3b82f6) | Red (#ef4444) | Red | Wall-locked |
| Light | Green (#10b981) | - | Green | Free movement |

## 🚀 Benefits

1. **Clear Constraints**: Users immediately see if device is wall-locked
2. **Visual Confirmation**: Animated feedback confirms drag is active
3. **Smooth Experience**: No jumpy movements or confusion
4. **Intuitive**: Color coding makes behavior obvious
5. **Professional**: Polish animations and indicators

## 📊 Performance

- Drag updates: ~60fps (browser native)
- Wall snapping: O(log n) using rbush spatial index
- Tooltip updates: Throttled to drag event rate
- Animations: CSS/SVG native (GPU accelerated)
- No performance impact on large projects

## 🎯 Edge Cases Handled

- ✅ Dragging while tooltip is open → Tooltip follows
- ✅ Dragging near room edge → Finds nearest wall (500px)
- ✅ Light-switch connection → Updates curve in real-time
- ✅ Multiple devices selected → Can drag any one
- ✅ Zoom/pan while dragging → Coordinates transform correctly

---

**Feature**: Enhanced Visual Dragging  
**Version**: 2.2  
**Status**: ✅ Complete & Ready  
**Updated**: November 2024
