import React from 'react';
import { Line } from 'react-konva';
import { PAPER_WIDTH, PAPER_HEIGHT, EDITOR_MARGIN, GRID_SIZE, SHOW_GRID, SHOW_MARGINS } from './constants';

// Relaxed component aliases to avoid JSX typing conflicts from react-konva types
const KLine = Line as unknown as React.ComponentType<any>;

interface EditorGuidesProps {
  showGrid?: boolean;
  showMargins?: boolean;
}

export const EditorGuides = ({ showGrid = SHOW_GRID, showMargins = SHOW_MARGINS }: EditorGuidesProps) => {
  // Generate grid lines
  const generateGridLines = () => {
    const lines = [];
    
    // Vertical grid lines
    for (let x = 0; x <= PAPER_WIDTH; x += GRID_SIZE) {
      lines.push(
        <KLine
          key={`v-grid-${x}`}
          points={[x, 0, x, PAPER_HEIGHT]}
          stroke="#e5e7eb"
          strokeWidth={1}
          opacity={0.5}
          listening={false}
        />
      );
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= PAPER_HEIGHT; y += GRID_SIZE) {
      lines.push(
        <KLine
          key={`h-grid-${y}`}
          points={[0, y, PAPER_WIDTH, y]}
          stroke="#e5e7eb"
          strokeWidth={1}
          opacity={0.5}
          listening={false}
        />
      );
    }
    
    return lines;
  };

  // Generate margin indicators
  const generateMarginLines = () => {
    const lines = [];
    
    // Top margin line
    lines.push(
      <KLine
        key="margin-top"
        points={[0, EDITOR_MARGIN, PAPER_WIDTH, EDITOR_MARGIN]}
        stroke="#3b82f6"
        strokeWidth={2}
        dash={[5, 5]}
        listening={false}
      />
    );
    
    // Bottom margin line
    lines.push(
      <KLine
        key="margin-bottom"
        points={[0, PAPER_HEIGHT - EDITOR_MARGIN, PAPER_WIDTH, PAPER_HEIGHT - EDITOR_MARGIN]}
        stroke="#3b82f6"
        strokeWidth={2}
        dash={[5, 5]}
        listening={false}
      />
    );
    
    // Left margin line
    lines.push(
      <KLine
        key="margin-left"
        points={[EDITOR_MARGIN, 0, EDITOR_MARGIN, PAPER_HEIGHT]}
        stroke="#3b82f6"
        strokeWidth={2}
        dash={[5, 5]}
        listening={false}
      />
    );
    
    // Right margin line
    lines.push(
      <KLine
        key="margin-right"
        points={[PAPER_WIDTH - EDITOR_MARGIN, 0, PAPER_WIDTH - EDITOR_MARGIN, PAPER_HEIGHT]}
        stroke="#3b82f6"
        strokeWidth={2}
        dash={[5, 5]}
        listening={false}
      />
    );
    
    return lines;
  };

  return (
    <>
      {showGrid && generateGridLines()}
      {showMargins && generateMarginLines()}
    </>
  );
};
