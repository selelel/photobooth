import React, { useRef, useEffect } from 'react';
import { Rect, Text, Image, Transformer, Group } from 'react-konva';
import type Konva from 'konva';
import { useImage } from './useImage';
import { DEFAULT_PICTURE_WIDTH, DEFAULT_PICTURE_HEIGHT, DEFAULT_PICTURE_BG_COLOR } from './constants';
import type { PictureShape } from './constants';
import { calculateSnapPosition, type BoundingBox } from './snappingUtils';

// Relaxed component aliases to avoid JSX typing conflicts from react-konva types
const KGroup = Group as unknown as React.ComponentType<any>;

interface PictureProps {
  shapeProps: PictureShape;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: PictureShape) => void;
  otherShapes?: PictureShape[];
  enableSnapping?: boolean;
  onSnapChange?: (snapResult: any) => void;
}

export const Picture = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
  otherShapes = [],
  enableSnapping = true,
  onSnapChange,
}: PictureProps) => {
  const groupRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const [loadedImage] = useImage(shapeProps.src ?? null);

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const width = shapeProps.width ?? DEFAULT_PICTURE_WIDTH;
  const height = shapeProps.height ?? DEFAULT_PICTURE_HEIGHT;
  const x = shapeProps.x ?? 0;
  const y = shapeProps.y ?? 0;
  const bg = shapeProps.bgColor ?? DEFAULT_PICTURE_BG_COLOR;
  const initials = (shapeProps.label ?? 'IMG')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('') || 'IMG';

  return (
    <React.Fragment>
      <KGroup
        ref={groupRef}
        x={x}
        y={y}
        draggable
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e: any) => {
          let newX = e.target.x();
          let newY = e.target.y();
          
          if (enableSnapping) {
            // Convert other shapes to bounding boxes for snapping calculation
            const otherBoundingBoxes: BoundingBox[] = otherShapes
              .filter(shape => shape.id !== shapeProps.id)
              .map(shape => ({
                x: shape.x,
                y: shape.y,
                width: shape.width,
                height: shape.height,
              }));
            
            // Calculate snap position
            const snapResult = calculateSnapPosition(
              { x: newX, y: newY, width, height },
              otherBoundingBoxes
            );
            
            newX = snapResult.x;
            newY = snapResult.y;
            
            // Notify parent about snap result for alignment guides
            if (onSnapChange) {
              onSnapChange(snapResult);
            }
          }
          
          onChange({
            ...shapeProps,
            x: newX,
            y: newY,
          });
        }}
        // TODO: How This Work?
        // onTransformEnd={() => {
        //   const node = groupRef.current;
        //   if (!node) return;
        //   const scaleX = node.scaleX();
        //   const scaleY = node.scaleY();
        //   node.scaleX(1);
        //   node.scaleY(1);
        //   onChange({
        //     ...shapeProps,
        //     x: node.x(),
        //     y: node.y(),
        //     width: Math.max(5, width * scaleX),
        //     height: Math.max(5, height * scaleY),
        //   });
        // }}
      >
        {loadedImage ? (
          <Image
            image={loadedImage as unknown as CanvasImageSource}
            width={width}
            height={height}
          />
        ) : (
          <React.Fragment>
            <Rect width={width} height={height} fill={bg} cornerRadius={Math.min(width, height) * 0.1} />
            <Text
              text={initials}
              width={width}
              height={height}
              align="center"
              fontStyle="bold"
              fill="#111827"
              fontSize={Math.round(Math.min(width, height) * 0.4)}
              y={height / 2 - Math.round(Math.min(width, height) * 0.4) / 2}
            />
          </React.Fragment>
        )}
      </KGroup>
      {isSelected && (
        <Transformer
          ref={trRef}
          flipEnabled={false}
          boundBoxFunc={(oldBox, newBox) => {
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};
