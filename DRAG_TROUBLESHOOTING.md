# Drag Functionality Troubleshooting

## ✅ Implementations Made

### 1. **useDrag Hook**
- Located in `lib/hooks/useDrag.ts`
- Listens for mousedown, mousemove, mouseup events
- Transforms screen coordinates to SVG local coordinates
- Should be working correctly

### 2. **DraggableDevice Component**
- Uses useDrag hook with ref on the `<g>` element
- Has invisible hitbox (20px radius circle) for easier grabbing
- Implements onStart, onMove, onEnd callbacks
- Tracks isDragging state for visual feedback

### 3. **Visual Feedback**
- Opacity reduces to 70% during drag
- Animated pulsing ring appears
- "WALL ONLY" or "FREE DRAG" labels show
- Different colors for different device types

## 🔍 Troubleshooting Steps

### Test 1: Check if Events Are Firing
Open browser DevTools Console and check if you see any errors when:
1. Clicking on a device
2. Trying to drag a device

### Test 2: Verify SVG Structure
The draggable element structure should be:
```xml
<svg id="editor-svg">
  <g id="devices">
    <g ref={dragRef} transform="translate(x,y)">
      <circle r="20" fill="transparent" />  <!-- Hitbox -->
      <Icon />
    </g>
  </g>
</svg>
```

### Test 3: Check Event Propagation
Issues might occur if:
- Parent SVG is capturing events
- Other elements are blocking pointer events
- Click handler is preventing drag

### Test 4: Verify useDrag Hook
The hook should:
1. Attach mousedown listener to the ref element
2. Set dragging = true on mousedown
3. Call onMove during mousemove (while dragging)
4. Call onEnd on mouseup

## 🐛 Common Issues & Fixes

### Issue 1: Pointer Events Blocked
**Symptom**: Can't click or drag devices
**Fix**: Check for `pointer-events: none` on parent elements

### Issue 2: Click vs Drag Confusion
**Symptom**: Click opens tooltip but drag doesn't work
**Fix**: ✅ Already implemented - dragStarted flag prevents click after drag

### Issue 3: SVG Coordinate Transform Issues
**Symptom**: Device jumps to wrong position when dragging
**Fix**: ✅ useDrag hook uses proper SVG coordinate transformation

### Issue 4: Event Bubbling
**Symptom**: Parent canvas pan interferes with device drag
**Fix**: Check if Editor's handleMouseDown is stopping device drag

## 🔧 Quick Fixes to Try

### Fix 1: Remove onClick Handler Temporarily
In `DraggableDevice.tsx`, temporarily comment out:
```typescript
onClick={handleClick}
```
Test if drag works without it.

### Fix 2: Add Debug Logging
Add console.log in useDrag hook:
```typescript
const handleMouseDown = (e: MouseEvent) => {
  console.log('Drag started');
  dragging = true;
  e.stopPropagation();
  onStart?.();
};

const handleMouseMove = (e: MouseEvent) => {
  if (!dragging) return;
  console.log('Dragging...', toLocal(e));
  const local = toLocal(e);
  onMove(local);
};
```

### Fix 3: Check Editor SVG Events
In `Editor.tsx`, make sure device drag events don't conflict:
```typescript
const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
  // Check if clicking on a device group
  const target = e.target as SVGElement;
  if (target.closest('#devices g[transform]')) {
    return; // Don't start panning if clicking a device
  }
  // ... pan logic
}
```

### Fix 4: Simplify Visual Feedback
Comment out all the animation/label elements temporarily:
```typescript
{/* Temporarily disable all visual feedback */}
{isDragging && (
  <circle r={24} fill="none" stroke="red" strokeWidth={2} />
)}
```

## 🧪 Manual Test Procedure

1. **Open the app** in browser
2. **Load sample floorplan** (click "Try Sample")
3. **Place a power point** - click "Power Point" tool, click on canvas
4. **Try to drag the power point**:
   - Hover over it (cursor should be 'move')
   - Click and hold
   - Move mouse
   - Release

### Expected Behavior:
- On mousedown: Device becomes 70% opacity, ring appears
- During drag: Device follows mouse, snaps to walls
- On mouseup: Device stays at new position, visual feedback disappears

### What to Check:
- ✅ Cursor changes to 'move' when hovering
- ✅ Visual feedback appears on mousedown
- ✅ Device position updates during drag
- ✅ Device snaps to walls (for power/switch)

## 🔍 Browser Console Checks

### Check 1: Event Listeners
In DevTools Console:
```javascript
// Get a device element
const device = document.querySelector('#devices g[transform]');
console.log(getEventListeners(device));
// Should show mousedown listener
```

### Check 2: Drag Ref
```javascript
// Check if ref is attached
const device = document.querySelector('#devices g[transform]');
console.log(device); // Should exist
```

### Check 3: SVG Transform
```javascript
// Check if coordinates transform correctly
const svg = document.querySelector('#editor-svg');
const pt = svg.createSVGPoint();
pt.x = 100;
pt.y = 100;
const transformed = pt.matrixTransform(svg.getScreenCTM().inverse());
console.log(transformed); // Should give SVG coordinates
```

## 🚀 If Still Not Working

### Nuclear Option: Rebuild useDrag
Replace useDrag with inline event handlers in DraggableDevice:

```typescript
const [dragging, setDragging] = React.useState(false);
const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });

const handleMouseDown = (e: React.MouseEvent) => {
  e.stopPropagation();
  setDragging(true);
  setDragStart({ x: e.clientX, y: e.clientY });
};

// Add window listeners for mousemove and mouseup
React.useEffect(() => {
  if (!dragging) return;
  
  const handleMouseMove = (e: MouseEvent) => {
    // Update position
  };
  
  const handleMouseUp = () => {
    setDragging(false);
  };
  
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  };
}, [dragging]);
```

## 📊 Current Status

### Implemented:
- ✅ useDrag hook with proper event handling
- ✅ SVG coordinate transformation
- ✅ Wall snapping logic
- ✅ Visual feedback
- ✅ Invisible hitbox for easier grabbing
- ✅ Click vs drag detection

### To Verify:
- ⚠️ Events actually firing
- ⚠️ No parent event blocking
- ⚠️ Coordinate transformation working
- ⚠️ UpdateNode being called

---

**Next Steps**: 
1. Test in browser with DevTools console open
2. Check for any JavaScript errors
3. Verify mousedown event fires on device
4. Add debug logging if needed
