import { createFileRoute } from '@tanstack/react-router';
import type Konva from 'konva';
import React from 'react';
import { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Text, Image, Transformer, Group } from 'react-konva';

// Relaxed component aliases to avoid JSX typing conflicts from react-konva types
const KStage = Stage as unknown as React.ComponentType<any>;
const KLayer = Layer as unknown as React.ComponentType<any>;
const KGroup = Group as unknown as React.ComponentType<any>;

type RectangleShape = Konva.RectConfig & { id: string };
type PictureShape = { id: string; x: number; y: number; width: number; height: number; src?: string; label?: string; bgColor?: string };

const Picture = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}: {
  shapeProps: PictureShape;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: PictureShape) => void;
}) => {
  const groupRef = useRef<Konva.Group>(null);
  const trRef = useRef<Konva.Transformer>(null);

  const [loadedImage] = useImage(shapeProps.src ?? null);

  useEffect(() => {
    if (isSelected && trRef.current && groupRef.current) {
      trRef.current.nodes([groupRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  const width = shapeProps.width ?? 100;
  const height = shapeProps.height ?? 100;
  const x = shapeProps.x ?? 0;
  const y = shapeProps.y ?? 0;
  const bg = shapeProps.bgColor ?? '#e5e7eb';
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
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = groupRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, width * scaleX),
            height: Math.max(5, height * scaleY),
          });
        }}
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

const Rectangle = ({
  shapeProps,
  isSelected,
  onSelect,
  onChange,
}: {
  shapeProps: RectangleShape;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: RectangleShape) => void;
}) => {
  const shapeRef = useRef<Konva.Rect>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Rect
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = shapeRef.current;
          if (!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
          });
        }}
      />
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

// 🪄 Custom hook for loading images
export function useImage(url: string | null) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading');

  useEffect(() => {
    if (!url) return;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous'; // allows using cloud images (e.g. Supabase)
    img.src = url;

    img.onload = () => {
      setImage(img);
      setStatus('loaded');
    };
    img.onerror = () => setStatus('failed');

    return () => {
      setImage(null);
      setStatus('loading');
    };
  }, [url]);

  return [image, status] as const;
}

// 🧩 Logo component for rendering draggable images
interface LogoProps {
  src: string;
  x: number;
  y: number;
  draggable?: boolean;
}

const Logo = ({ src, x, y, draggable = false }: LogoProps) => {
  const [image] = useImage(src);
  return (
    <Image
      image={image as unknown as CanvasImageSource}
      x={x}
      y={y}
      draggable={draggable}
    />
  );
};

// 🧭 Route definition
export const Route = createFileRoute('/test/editor')({
  component: RouteComponent,
});

// 🖼️ Main Editor Component
function RouteComponent() {
  const [bgColor, setBgColor] = useState('#ffffff');
  const stageRef = useRef<any>(null);
  const STAGE_WIDTH = 900;
  const STAGE_HEIGHT = 600;

  const handleExport = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
      console.log(uri); // TODO: upload to Supabase or print
    } else {
      console.warn('Stage reference is not set.');
    }
  };

  const initialRectangles: RectangleShape[] = [
    { id: 'rect-1', x: 120, y: 120, width: 180, height: 120, fill: '#ffcc00' },
    { id: 'rect-2', x: 360, y: 220, width: 160, height: 100, fill: '#66ccff' },
  ];

  const [rectangles, setRectangles] = React.useState<RectangleShape[]>(initialRectangles);
  const [selectedId, selectShape] = React.useState<string | null>(null);

  const initialPictures: PictureShape[] = [
    {
        "id": "pic-4-6",
        "x": 0,
        "y": 0,
        "width": 900,
        "height": 600,
        "src": "/kirby.png",
        "label": "Guest One"
    },
    {
        "id": "pic-1",
        "x": 44,
        "y": 43,
        "width": 225,
        "height": 225,
        "src": "/pwa.jpg",
        "label": "Photo Booth"
    },
    {
        "id": "pic-2",
        "x": 338,
        "y": 43,
        "width": 225,
        "height": 225,
        "src": "/pwa.jpg",
        "label": "Guest One"
    },
    {
        "id": "pic-3",
        "x": 631,
        "y": 43,
        "width": 225,
        "height": 225,
        "src": "/pwa.jpg",
        "label": "Guest One"
    },
    {
        "id": "pic-4",
        "x": 44,
        "y": 333,
        "width": 225,
        "height": 225,
        "src": "/pwa.jpg",
        "label": "Guest One"
    },
    {
        "id": "pic-4-2",
        "x": 338,
        "y": 333,
        "width": 225,
        "height": 225,
        "src": "/pwa.jpg",
        "label": "Guest One"
    },
];

const backgroundImage= { id: 'pic-4', x: 0, y: 0, width: 900, height: 600, src: '/kirby.png', label: 'Guest One' }

  const [pictures, setPictures] = React.useState<PictureShape[]>(() => {
    const seen = new Map<string, number>();
  
    return [...(initialPictures.map((p) => {
      const count = seen.get(p.id) ?? 0;
      seen.set(p.id, count + 1);
  
      // if it's the first one, keep original id
      if (count === 0) return p;
  
      // if duplicate, add suffix
      return { ...p, id: `${p.id}-${count + 1}` };
    })), ]
  });

//   const distributeEvenly = (columns?: number) => {
//     const n = pictures.length;
//     if (n === 0) return;
//     const cols = columns ?? Math.ceil(Math.sqrt(n));
//     const rows = Math.ceil(n / cols);
//     const margin = 20;
//     const areaX = 0;
//     const areaY = 0;
//     const areaW = STAGE_WIDTH;
//     const areaH = STAGE_HEIGHT;
//     const cellW = (areaW - margin * (cols + 1)) / cols;
//     const cellH = (areaH - margin * (rows + 1)) / rows;

//     setPictures((prev) => {
//         const curr = prev.map((p, i) => {
//             const col = i % cols;
//             const row = Math.floor(i / cols);
//             const maxW = Math.max(5, cellW);
//             const maxH = Math.max(5, cellH);
//             const newW = Math.min(p.width ?? maxW, maxW);
//             const newH = Math.min(p.height ?? maxH, maxH);
//             const baseX = areaX + margin + col * (cellW + margin);
//             const baseY = areaY + margin + row * (cellH + margin);
//             const centeredX = baseX + (cellW - newW) / 2;
//             const centeredY = baseY + (cellH - newH) / 2;
//             return {
//                 ...p,
//                 x: Math.round(centeredX),
//                 y: Math.round(centeredY),
//                 width: Math.round(newW),
//                 height: Math.round(newH),
//             };
//         })
//         console.log(curr)
//         return curr
//     })
// }

  const checkDeselect = (e: any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  return (
    <div>
      <input
        type="color"
        value={bgColor}
        onChange={(e) => setBgColor(e.target.value)}
        className="m-2"
      />
      <button onClick={handleExport} className="p-2 bg-gray-200 rounded">
        Save Template
      </button>
      <button 
    //   onClick={() => distributeEvenly()} 
      className="ml-2 p-2 bg-gray-200 rounded">
        Distribute Evenly
      </button>

      <KStage className="border-2 border-black w-fit" width={STAGE_WIDTH} height={STAGE_HEIGHT} ref={stageRef}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}>
        <KLayer>
          <Rect width={900} height={600} fill={bgColor} />
          <Text text="Mama mo" x={50} y={50} draggable={true} />
          {/* <Logo src="/kirby.png" x={0} y={0} draggable={true} /> */}
          <Picture
              key={"bacground-pic-1"}
              shapeProps={{ id: 'bacground-pic-1', x: 30, y: 30, width: 225, height: 225, src: '/pwa.jpg', label: 'Photo Booth' }}
              isSelected={selectedId === "bacground-pic-1"}
              onSelect={() => selectShape("bacground-pic-1")}
              onChange={(newAttrs) => {
                setPictures((prev) => prev.map((p) => (p.id === pictures[pictures.length -1].id ? { ...p, ...newAttrs } : p)));
              }}
            />
          {(pictures.filter((e) => e.id !== "bg-pic-1")).map((pic) => (
            <Picture
              key={pic.id}
              shapeProps={pic}
              isSelected={selectedId === pic.id}
              onSelect={() => selectShape(pic.id)}
              onChange={(newAttrs) => {
                setPictures((prev) => prev.map((p) => (p.id === pic.id ? { ...p, ...newAttrs } : p)));
              }}
            />
          ))}
          {/* {rectangles.map((rect) => (
            <Rectangle
              key={rect.id}
              shapeProps={rect}
              isSelected={rect.id === selectedId}
              onSelect={() => selectShape(rect.id)}
              onChange={(newAttrs) => {
                setRectangles((prev) =>
                  prev.map((r) => (r.id === rect.id ? { ...r, ...newAttrs } : r))
                );
              }}
            />
          ))} */}
        </KLayer>
      </KStage>
    </div>  
  );
}
