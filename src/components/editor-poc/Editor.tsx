import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { Picture } from './Picture';
import { 
  PAPER_WIDTH, 
  PAPER_HEIGHT, 
  DEFAULT_BACKGROUND_COLOR, 
  GRID_MARGIN,
  MIN_SHAPE_SIZE,
  INITIAL_PICTURES_LANDSCAPE_4,
  INITIAL_PICTURES_LANDSCAPE_3,
  INITIAL_PICTURES_LANDSCAPE_2,
  INITIAL_PICTURES_LANDSCAPE_1,
} from './constants';
import type { PictureShape } from './constants';

// Relaxed component aliases to avoid JSX typing conflicts from react-konva types
const KStage = Stage as unknown as React.ComponentType<any>;
const KLayer = Layer as unknown as React.ComponentType<any>;

export const Editor = () => {
  const [bgColor, setBgColor] = useState(DEFAULT_BACKGROUND_COLOR);
  const stageRef = useRef<any>(null);
  const [selectedId, selectShape] = React.useState<string | null>(null);
  const [image, setImage] = useState<Base64URLString | null>()

  const [pictures, setPictures] = React.useState<PictureShape[]>(() => {
    const seen = new Map<string, number>();
  
    return [...(INITIAL_PICTURES_LANDSCAPE_1.map((p) => {
      const count = seen.get(p.id) ?? 0;
      seen.set(p.id, count + 1);
  
      // if it's the first one, keep original id
      if (count === 0) return p;
  
      // if duplicate, add suffix
      return { ...p, id: `${p.id}-${count + 1}` };
    })), ]
  });

  const handleExport = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
      setImage(uri); // TODO: upload to Supabase or print
    } else {
      console.warn('Stage reference is not set.');
    }
  };

  const distributeEvenly = (columns?: number) => {
    const n = pictures.length;
    if (n === 0) return;
    const cols = columns ?? Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    const margin = GRID_MARGIN;
    const areaX = 0;
    const areaY = 0;
    const areaW = PAPER_WIDTH;
    const areaH = PAPER_HEIGHT;
    const cellW = (areaW - margin * (cols + 1)) / cols;
    const cellH = (areaH - margin * (rows + 1)) / rows;

    setPictures((prev) => {
        const curr = prev.map((p, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const maxW = Math.max(MIN_SHAPE_SIZE, cellW);
            const maxH = Math.max(MIN_SHAPE_SIZE, cellH);
            const newW = Math.min(p.width ?? maxW, maxW);
            const newH = Math.min(p.height ?? maxH, maxH);
            const baseX = areaX + margin + col * (cellW + margin);
            const baseY = areaY + margin + row * (cellH + margin);
            const centeredX = baseX + (cellW - newW) / 2;
            const centeredY = baseY + (cellH - newH) / 2;
            return {
                ...p,
                x: Math.round(centeredX),
                y: Math.round(centeredY),
                width: Math.round(newW),
                height: Math.round(newH),
            };
        })
        console.log(curr)
        return curr
    })
  }

  const getPosition = () => {
    console.log(pictures)
  }

  const checkDeselect = (e: any) => {
    // deselect when clicked on empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  return (
    <div className='flex justify-between gap-6'>
      <KStage 
        className="border-2 border-black w-fit" 
        width={PAPER_WIDTH} 
        height={PAPER_HEIGHT} 
        ref={stageRef}
        onMouseDown={checkDeselect}
        onTouchStart={checkDeselect}
      >
        <KLayer>
          <Rect width={PAPER_WIDTH} height={PAPER_HEIGHT} fill={bgColor} />
          <Picture
              key={pictures[0].id}
              shapeProps={pictures[0]}
              isSelected={selectedId === pictures[0].id}
              onSelect={() => selectShape(pictures[0].id)}
              onChange={(newAttrs) => {
                setPictures((prev) => prev.map((p) => (p.id === pictures[0].id ? { ...p, ...newAttrs } : p)));
              }}
            />
          
          {(pictures.filter((e) => e.id !== "pic-background")).map((pic) => (
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
        </KLayer>
      </KStage>
      <div className='flex flex-1 flex-col gap-2'>
        <div>
            <input
                type="color"
                value={'bgColor'}
                onChange={(e) => setBgColor(e.target.value)}
                className="m-2"
                />
                <button onClick={handleExport} className="p-2 bg-gray-200 rounded">
                    Save Template
                </button>
                <button 
                    onClick={() => distributeEvenly()} 
                    className="ml-2 p-2 bg-gray-200 rounded">
                    Distribute Evenly
                </button>
                <button 
                    onClick={() => getPosition()} 
                    className="ml-2 p-2 bg-gray-200 rounded">
                    Get Images Position
                </button>
        </div>

        <div>
            <p>{JSON.stringify(pictures, null, 2)}</p>
            {image && <img src={image} className='w-full'/>}
        </div>
      </div>
    </div>  
  );
};
