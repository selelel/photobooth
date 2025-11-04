import React from 'react';
import { Line } from 'react-konva';
import { getPaperDimensions } from '../../editor-poc/constants';

// Relaxed component aliases to avoid JSX typing conflicts from react-konva types
const KLine = Line as unknown as React.ComponentType<any>;

interface AlignmentGuidesProps {
  verticalGuide?: number;
  horizontalGuide?: number;
  showGuides?: boolean;
  orientation: 'portrait' | 'landscape';
}

export const AlignmentGuides = ({ 
  verticalGuide, 
  horizontalGuide, 
  showGuides = true,
  orientation
}: AlignmentGuidesProps) => {
  if (!showGuides || (!verticalGuide && !horizontalGuide)) {
    return null;
  }
  const { width: PAPER_WIDTH, height :PAPER_HEIGHT} = getPaperDimensions(orientation);

  return (
    <>
      {/* Vertical alignment guide */}
      {verticalGuide !== undefined && (
        <KLine
          points={[verticalGuide, 0, verticalGuide, PAPER_HEIGHT]}
          stroke="#ff6b6b"
          strokeWidth={2}
          dash={[8, 4]}
          opacity={0.8}
          listening={false}
        />
      )}
      
      {/* Horizontal alignment guide */}
      {horizontalGuide !== undefined && (
        <KLine
          points={[0, horizontalGuide, PAPER_WIDTH, horizontalGuide]}
          stroke="#ff6b6b"
          strokeWidth={2}
          dash={[8, 4]}
          opacity={0.8}
          listening={false}
        />
      )}
    </>
  );
};
