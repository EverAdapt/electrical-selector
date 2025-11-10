# Interactive Wire Features

## ✅ Features Implemented

### 1. **Visible Light-Switch Connections**
- **3px thick blue dashed lines** connecting lights to switches
- **8-6 dash pattern** for clear visibility
- **80% opacity** - prominent but not overwhelming
- Auto-creates when placing a light point

### 2. **Automatic Curve Updates**
- Lines automatically recalculate when devices move
- Smooth curved paths using Quadratic Bezier
- Default curve: 20% perpendicular offset from center

### 3. **Interactive Curve Editing**
- **Click and drag anywhere on the line** to reshape the curve
- Creates custom control point at drag location
- Stores control point in edge data (persists across sessions)

### 4. **Visual Feedback While Editing**
- **Control point handle**: Small blue circle at curve peak
- **Visual guides**: Dashed lines showing control tangents (when dragging)
- **Larger handle**: Circle grows from 6px to 8px when dragging
- **Cursor changes**: Shows 'move' cursor over line and handle

## 🎨 Visual Design

### Wire Appearance
```
Light ◉━━━━━━━◉ Control Point ◉━━━━━━━◉ Switch
       \                              /
        \____________________________/
         Blue dashed curved line (3px)
```

### Control Point Handle
- **Default state**: Small white circle (6px) with blue stroke
- **Hover state**: Cursor changes to 'move'
- **Dragging state**: 
  - Larger blue circle (8px)
  - Dashed guide lines visible
  - Full opacity

## 🖱️ User Interactions

### Viewing Connections
- Lines appear automatically when light is placed
- Visible at all times for easy identification
- Curved shape avoids overlapping with devices

### Reshaping Curves
1. **Hover over the line** - cursor changes to pointer
2. **Click and hold** anywhere on the line
3. **Drag** to desired curve shape
4. **Release** to set the new curve
5. Custom curve is **saved automatically**

### Moving Devices
- **Drag light or switch** - curve updates in real-time
- Custom control point position is **preserved relatively**
- Line remains smooth and connected

## 🔧 Technical Details

### Path Calculation
```typescript
// Default curved path (if no custom control point)
const dx = targetX - sourceX;
const dy = targetY - sourceY;
const offsetX = -dy * 0.2;  // Perpendicular to line
const offsetY = dx * 0.2;
const cx = midX + offsetX;
const cy = midY + offsetY;

// Quadratic Bezier
path = `M ${sourceX},${sourceY} Q ${cx},${cy} ${targetX},${targetY}`;
```

### Custom Control Points
```typescript
// Stored in edge.data
interface EdgeData {
  controlPoint?: { x: number; y: number };
  label?: string;
  points?: { x: number; y: number }[];
}
```

### Hit Detection
```svg
<!-- Invisible wide hitbox for easy clicking -->
<path d={path} stroke="transparent" strokeWidth={20} />

<!-- Visible wire -->
<path d={path} stroke="#6366f1" strokeWidth={3} strokeDasharray="8 6" />

<!-- Draggable control point -->
<circle cx={cx} cy={cy} r={6} />
```

## 📋 Usage Guide

### Creating Light-Switch Connection
1. Click **"Light Point"** tool
2. Click on floorplan
3. Light + Switch + **Curved Wire** appear automatically
4. Blue dashed line connects them

### Editing Wire Shape
**Method 1: Drag the line**
- Click anywhere on the line
- Drag to reshape
- Release to set

**Method 2: Drag control point**
- Click the small circle at curve peak
- Drag to adjust curve
- See guide lines while dragging

### Moving Connected Devices
- **Drag light** - wire follows
- **Drag switch** - wire follows
- Custom curve shape is maintained
- Line updates smoothly in real-time

## 🎯 Smart Behaviors

### Default Curve
- Automatically positioned 20% perpendicular to straight line
- Creates pleasing arc avoiding devices
- Good default for most scenarios

### Custom Curve
- User can override default by dragging
- Control point position is saved
- Persists across app restarts (in JSON export)
- Recalculates smoothly when devices move

### Visual Guides
- **Dashed tangent lines**: Only show when dragging control point
- **Control handle**: Always visible but subtle (60% opacity)
- **Handle highlight**: Grows and fills when dragging

## 🚀 Benefits

1. **Clear Connections**: Easy to see which lights connect to which switches
2. **Professional Look**: Smooth curves look polished
3. **Flexible Layout**: Custom curves work around obstacles
4. **Real-time Updates**: No manual reconnection needed
5. **Persistent**: Custom curves save with project

## 🎨 Color Scheme

| Element | Color | Purpose |
|---------|-------|---------|
| Wire line | Blue #6366f1 | Light-switch identification |
| Control point | White fill, Blue stroke | Draggable handle |
| Guide lines | Blue #6366f1 (30% opacity) | Visual aid when editing |
| Dragging handle | Blue fill | Active state feedback |

## 🔄 Automatic Updates

### When Devices Move
```
Before:  Light ──○── Switch
After:   Light ─╰─○─╯─ Switch
         ↓               ↓
      New position   New position
         
Curve automatically recalculates
Control point moves proportionally
```

### When Line is Dragged
```
Default:  Light ────○──── Switch
                    │
                 (default)

Custom:   Light ─╰───○───╮─ Switch
                     │
                  (custom)

User drags line → Control point created/updated
```

## 📊 Performance

- **Path calculation**: O(1) - simple math
- **Hit detection**: 20px wide invisible hitbox
- **Drag updates**: Throttled to 60fps
- **No lag** even with many connections

## 💡 Tips

- **Subtle curves**: Works best for moderate cable routing
- **Extreme curves**: Can create dramatic bends if needed
- **Reset curve**: Delete and recreate connection for default
- **Multiple curves**: Each connection independently editable

---

**Feature**: Interactive Curved Wires  
**Version**: 3.0  
**Status**: ✅ Complete  
**Updated**: November 2024
