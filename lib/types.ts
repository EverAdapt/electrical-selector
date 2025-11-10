import { z } from 'zod';

// Device node types
export type DeviceKind = 'power' | 'light' | 'switch';

export const NodeDataSchema = z.object({
  label: z.string().optional(),
  circuitId: z.string().optional(),
  heightMm: z.number().optional(),
  notes: z.string().optional(),
  switchType: z.enum(['1g', '2g', '3g', 'dimmer']).optional(), // for switches
  powerType: z.enum(['single', 'double']).optional(), // for power points
  lightType: z.enum(['ceiling', 'wall']).optional(), // for lights
});

export type NodeData = z.infer<typeof NodeDataSchema>;

export const DeviceNodeSchema = z.object({
  id: z.string(),
  kind: z.enum(['power', 'light', 'switch']),
  position: z.object({ x: z.number(), y: z.number() }),
  rotation: z.number().optional(),
  data: NodeDataSchema.optional(),
});

export type DeviceNode = z.infer<typeof DeviceNodeSchema>;

// Edge/Wire types
export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  data: z.object({
    label: z.string().optional(),
    points: z.array(z.object({ x: z.number(), y: z.number() })).optional(),
    controlPoint: z.object({ x: z.number(), y: z.number() }).optional(), // For curved lines
  }).optional(),
});

export type Edge = z.infer<typeof EdgeSchema>;

// Wall segment types
export const WallSegmentSchema = z.object({
  id: z.string(),
  points: z.array(z.object({ x: z.number(), y: z.number() })),
});

export type WallSegment = z.infer<typeof WallSegmentSchema>;

// Background floorplan
export const BackgroundSchema = z.object({
  type: z.enum(['svg', 'image', 'pdf']),
  url: z.string(),
  page: z.number().optional(),
  scale: z.number().optional(),
});

export type Background = z.infer<typeof BackgroundSchema>;

// Metadata
export const MetaSchema = z.object({
  grid: z.number().optional(),
  units: z.enum(['mm', 'in']).optional(),
  pxPerMeter: z.number().optional(),
});

export type Meta = z.infer<typeof MetaSchema>;

// Complete floorplan document
export const FloorplanDocSchema = z.object({
  id: z.string(),
  name: z.string(),
  background: BackgroundSchema.optional(),
  walls: z.array(WallSegmentSchema).optional(),
  nodes: z.array(DeviceNodeSchema),
  edges: z.array(EdgeSchema),
  meta: MetaSchema.optional(),
});

export type FloorplanDoc = z.infer<typeof FloorplanDocSchema>;

// Snap result
export interface SnapResult {
  x: number;
  y: number;
  angle: number; // radians
  segmentId: string;
  distance: number;
}

// Spatial index item
export interface SegmentItem {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// Viewport state
export interface ViewportState {
  zoom: number;
  pan: { x: number; y: number };
}
