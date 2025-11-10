import RBush from 'rbush';
import { Point, Segment, point, segment } from '@flatten-js/core';
import type { WallSegment, SegmentItem, SnapResult } from './types';

/**
 * Build spatial index from wall segments for fast nearest-wall queries
 */
export function buildWallIndex(walls: WallSegment[]): RBush<SegmentItem> {
  const tree = new RBush<SegmentItem>();
  const items: SegmentItem[] = [];

  for (const wall of walls) {
    for (let i = 0; i < wall.points.length - 1; i++) {
      const p1 = wall.points[i];
      const p2 = wall.points[i + 1];
      
      items.push({
        minX: Math.min(p1.x, p2.x),
        minY: Math.min(p1.y, p2.y),
        maxX: Math.max(p1.x, p2.x),
        maxY: Math.max(p1.y, p2.y),
        id: `${wall.id}-${i}`,
        x1: p1.x,
        y1: p1.y,
        x2: p2.x,
        y2: p2.y,
      });
    }
  }

  tree.load(items);
  return tree;
}

/**
 * Snap a point to the nearest wall segment within tolerance
 */
export function snapToWalls(
  wallIndex: RBush<SegmentItem>,
  x: number,
  y: number,
  tolerance: number
): SnapResult | null {
  // Query nearby segments using a bounding box
  const nearby = wallIndex.search({
    minX: x - tolerance,
    minY: y - tolerance,
    maxX: x + tolerance,
    maxY: y + tolerance,
  });

  if (nearby.length === 0) return null;

  const pt = point(x, y);
  let bestSnap: SnapResult | null = null;
  let minDistance = tolerance;

  for (const item of nearby) {
    const seg = segment(point(item.x1, item.y1), point(item.x2, item.y2));
    
    // Project point onto segment
    const projected = projectPointToSegment(pt, seg);
    const distance = pt.distanceTo(projected)[0];

    if (distance < minDistance) {
      minDistance = distance;
      const angle = Math.atan2(item.y2 - item.y1, item.x2 - item.x1);
      
      bestSnap = {
        x: projected.x,
        y: projected.y,
        angle,
        segmentId: item.id,
        distance,
      };
    }
  }

  return bestSnap;
}

/**
 * Project a point onto a segment (clamped to segment endpoints)
 */
function projectPointToSegment(pt: Point, seg: Segment): Point {
  const { ps: p1, pe: p2 } = seg;
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const lenSquared = dx * dx + dy * dy;

  if (lenSquared === 0) return p1; // Degenerate segment

  // Parameter t along the segment
  let t = ((pt.x - p1.x) * dx + (pt.y - p1.y) * dy) / lenSquared;
  t = Math.max(0, Math.min(1, t)); // Clamp to [0, 1]

  return point(p1.x + t * dx, p1.y + t * dy);
}

/**
 * Convert radians to degrees
 */
export function radToDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Convert degrees to radians
 */
export function degToRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Parse simple SVG paths/lines/polylines into wall segments
 */
export function parseSVGWalls(svgElement: SVGSVGElement): WallSegment[] {
  const walls: WallSegment[] = [];
  let wallId = 0;

  // Extract lines
  const lines = svgElement.querySelectorAll('line');
  lines.forEach((line) => {
    const x1 = parseFloat(line.getAttribute('x1') || '0');
    const y1 = parseFloat(line.getAttribute('y1') || '0');
    const x2 = parseFloat(line.getAttribute('x2') || '0');
    const y2 = parseFloat(line.getAttribute('y2') || '0');
    
    walls.push({
      id: `wall-${wallId++}`,
      points: [{ x: x1, y: y1 }, { x: x2, y: y2 }],
    });
  });

  // Extract polylines
  const polylines = svgElement.querySelectorAll('polyline');
  polylines.forEach((polyline) => {
    const pointsStr = polyline.getAttribute('points') || '';
    const points = parsePointsString(pointsStr);
    if (points.length > 1) {
      walls.push({
        id: `wall-${wallId++}`,
        points,
      });
    }
  });

  // Extract rect elements (convert to polylines)
  const rects = svgElement.querySelectorAll('rect');
  rects.forEach((rect) => {
    const x = parseFloat(rect.getAttribute('x') || '0');
    const y = parseFloat(rect.getAttribute('y') || '0');
    const width = parseFloat(rect.getAttribute('width') || '0');
    const height = parseFloat(rect.getAttribute('height') || '0');
    
    walls.push({
      id: `wall-${wallId++}`,
      points: [
        { x, y },
        { x: x + width, y },
        { x: x + width, y: y + height },
        { x, y: y + height },
        { x, y }, // Close the rectangle
      ],
    });
  });

  return walls;
}

/**
 * Parse SVG points attribute string (e.g., "10,20 30,40 50,60")
 */
function parsePointsString(pointsStr: string): Array<{ x: number; y: number }> {
  const points: Array<{ x: number; y: number }> = [];
  const coords = pointsStr.trim().split(/[\s,]+/);
  
  for (let i = 0; i < coords.length - 1; i += 2) {
    const x = parseFloat(coords[i]);
    const y = parseFloat(coords[i + 1]);
    if (!isNaN(x) && !isNaN(y)) {
      points.push({ x, y });
    }
  }
  
  return points;
}
