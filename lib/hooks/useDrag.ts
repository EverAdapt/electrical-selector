import React from 'react';

interface UseDragOptions {
  onMove: (pt: { x: number; y: number }) => void;
  onEnd?: () => void;
  onStart?: () => void;
}

/**
 * Hook for dragging SVG elements with proper coordinate transformation
 */
export function useDrag({ onMove, onEnd, onStart }: UseDragOptions) {
  const ref = React.useRef<SVGGElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let dragging = false;
    const svg = el.ownerSVGElement;
    if (!svg) return;

    const pt = svg.createSVGPoint();

    const toLocal = (e: MouseEvent): { x: number; y: number } => {
      pt.x = e.clientX;
      pt.y = e.clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return { x: 0, y: 0 };
      const transformed = pt.matrixTransform(ctm.inverse());
      return { x: transformed.x, y: transformed.y };
    };

    const handleMouseDown = (e: MouseEvent) => {
      dragging = true;
      e.stopPropagation();
      e.preventDefault();
      onStart?.();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragging) return;
      const local = toLocal(e);
      onMove(local);
    };

    const handleMouseUp = () => {
      if (!dragging) return;
      dragging = false;
      onEnd?.();
    };

    el.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      el.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onMove, onEnd, onStart]);

  return ref;
}
