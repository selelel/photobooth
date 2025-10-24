import { PAPER_WIDTH, PAPER_HEIGHT, EDITOR_MARGIN, SNAP_THRESHOLD, GRID_SIZE } from './constants';

export interface SnapResult {
  x: number;
  y: number;
  snappedTo: string[];
  alignmentGuides?: {
    vertical?: number;
    horizontal?: number;
  };
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Calculate snap position for a shape based on margins, grid, and other shapes
 */
export const calculateSnapPosition = (
  targetShape: BoundingBox,
  otherShapes: BoundingBox[],
  snapToGrid: boolean = true,
  snapToMargins: boolean = true,
  snapToShapes: boolean = true
): SnapResult => {
  let snappedX = targetShape.x;
  let snappedY = targetShape.y;
  const snappedTo: string[] = [];
  const alignmentGuides: { vertical?: number; horizontal?: number } = {};

  // Snap to margins
  if (snapToMargins) {
    // Left margin
    if (Math.abs(targetShape.x - EDITOR_MARGIN) < SNAP_THRESHOLD) {
      snappedX = EDITOR_MARGIN;
      snappedTo.push('left-margin');
    }
    // Right margin
    else if (Math.abs(targetShape.x + targetShape.width - (PAPER_WIDTH - EDITOR_MARGIN)) < SNAP_THRESHOLD) {
      snappedX = PAPER_WIDTH - EDITOR_MARGIN - targetShape.width;
      snappedTo.push('right-margin');
    }
    // Top margin
    if (Math.abs(targetShape.y - EDITOR_MARGIN) < SNAP_THRESHOLD) {
      snappedY = EDITOR_MARGIN;
      snappedTo.push('top-margin');
    }
    // Bottom margin
    else if (Math.abs(targetShape.y + targetShape.height - (PAPER_HEIGHT - EDITOR_MARGIN)) < SNAP_THRESHOLD) {
      snappedY = PAPER_HEIGHT - EDITOR_MARGIN - targetShape.height;
      snappedTo.push('bottom-margin');
    }
  }

  // Snap to grid
  if (snapToGrid) {
    // Snap X to grid
    const gridX = Math.round(snappedX / GRID_SIZE) * GRID_SIZE;
    if (Math.abs(snappedX - gridX) < SNAP_THRESHOLD && !snappedTo.includes('left-margin') && !snappedTo.includes('right-margin')) {
      snappedX = gridX;
      snappedTo.push('grid-x');
    }
    
    // Snap Y to grid
    const gridY = Math.round(snappedY / GRID_SIZE) * GRID_SIZE;
    if (Math.abs(snappedY - gridY) < SNAP_THRESHOLD && !snappedTo.includes('top-margin') && !snappedTo.includes('bottom-margin')) {
      snappedY = gridY;
      snappedTo.push('grid-y');
    }
  }

  // Snap to other shapes
  if (snapToShapes) {
    for (const otherShape of otherShapes) {
      // Skip if it's the same shape
      if (targetShape === otherShape) continue;

      // Snap to left edge of other shape
      if (Math.abs(snappedX - otherShape.x) < SNAP_THRESHOLD && !snappedTo.includes('left-margin')) {
        snappedX = otherShape.x;
        snappedTo.push('shape-left');
      }
      // Snap to right edge of other shape
      else if (Math.abs(snappedX + targetShape.width - (otherShape.x + otherShape.width)) < SNAP_THRESHOLD && !snappedTo.includes('right-margin')) {
        snappedX = otherShape.x + otherShape.width - targetShape.width;
        snappedTo.push('shape-right');
      }
      // Snap to top edge of other shape
      if (Math.abs(snappedY - otherShape.y) < SNAP_THRESHOLD && !snappedTo.includes('top-margin')) {
        snappedY = otherShape.y;
        snappedTo.push('shape-top');
      }
      // Snap to bottom edge of other shape
      else if (Math.abs(snappedY + targetShape.height - (otherShape.y + otherShape.height)) < SNAP_THRESHOLD && !snappedTo.includes('bottom-margin')) {
        snappedY = otherShape.y + otherShape.height - targetShape.height;
        snappedTo.push('shape-bottom');
      }
      
      // Snap to center alignment (horizontal center alignment)
      const targetCenterX = snappedX + targetShape.width / 2;
      const otherCenterX = otherShape.x + otherShape.width / 2;
      if (Math.abs(targetCenterX - otherCenterX) < SNAP_THRESHOLD && !snappedTo.includes('left-margin') && !snappedTo.includes('right-margin')) {
        snappedX = otherCenterX - targetShape.width / 2;
        snappedTo.push('shape-center-x');
        alignmentGuides.vertical = otherCenterX;
      }
      
      // Snap to center alignment (vertical center alignment)
      const targetCenterY = snappedY + targetShape.height / 2;
      const otherCenterY = otherShape.y + otherShape.height / 2;
      if (Math.abs(targetCenterY - otherCenterY) < SNAP_THRESHOLD && !snappedTo.includes('top-margin') && !snappedTo.includes('bottom-margin')) {
        snappedY = otherCenterY - targetShape.height / 2;
        snappedTo.push('shape-center-y');
        alignmentGuides.horizontal = otherCenterY;
      }
      
      // Snap to same X axis (left edge alignment)
      if (Math.abs(snappedX - otherShape.x) < SNAP_THRESHOLD && !snappedTo.includes('left-margin')) {
        snappedX = otherShape.x;
        snappedTo.push('same-x-axis');
        alignmentGuides.vertical = otherShape.x;
      }
      
      // Snap to same Y axis (top edge alignment)
      if (Math.abs(snappedY - otherShape.y) < SNAP_THRESHOLD && !snappedTo.includes('top-margin')) {
        snappedY = otherShape.y;
        snappedTo.push('same-y-axis');
        alignmentGuides.horizontal = otherShape.y;
      }
    }
  }

  // Ensure the shape stays within bounds
  snappedX = Math.max(0, Math.min(snappedX, PAPER_WIDTH - targetShape.width));
  snappedY = Math.max(0, Math.min(snappedY, PAPER_HEIGHT - targetShape.height));

  return {
    x: snappedX,
    y: snappedY,
    snappedTo,
    alignmentGuides: Object.keys(alignmentGuides).length > 0 ? alignmentGuides : undefined
  };
};

/**
 * Check if a position is within the safe margin area
 */
export const isWithinMargins = (x: number, y: number, width: number, height: number): boolean => {
  return x >= EDITOR_MARGIN && 
         y >= EDITOR_MARGIN && 
         x + width <= PAPER_WIDTH - EDITOR_MARGIN && 
         y + height <= PAPER_HEIGHT - EDITOR_MARGIN;
};
