import React, { useState, useRef } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { Picture } from './Picture';
import { EditorGuides } from '../dashboard/template-creation/editor-guides';
import { AlignmentGuides } from '../dashboard/template-creation/alignment-guides';
import { 
  PAPER_WIDTH, 
  PAPER_HEIGHT, 
  DEFAULT_BACKGROUND_COLOR, 
  GRID_MARGIN,
  MIN_SHAPE_SIZE,
  INITIAL_PICTURES_PORTRAIT_2,
} from './constants';
import type { PictureShape } from './constants';

// Relaxed component aliases to avoid JSX typing conflicts from react-konva types
const KStage = Stage as unknown as React.ComponentType<any>;
const KLayer = Layer as unknown as React.ComponentType<any>;

export const Editor = () => {
  const [bgColor, setBgColor] = useState(DEFAULT_BACKGROUND_COLOR);
  const stageRef = useRef<any>(null);
  const [selectedId, selectShape] = React.useState<string | null>(null);
  const [image, setImage] = useState<Base64URLString | null>();
  const [showGrid, setShowGrid] = useState(true);
  const [showMargins, setShowMargins] = useState(true);
  const [enableSnapping, setEnableSnapping] = useState(true);
  const [alignmentGuides, setAlignmentGuides] = useState<{ vertical?: number; horizontal?: number }>({});

  const [pictures, setPictures] = React.useState<PictureShape[]>(INITIAL_PICTURES_PORTRAIT_2);

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
      setAlignmentGuides({}); // Clear alignment guides when deselecting
    }
  };

  const handleSnapChange = (snapResult: any) => {
    setAlignmentGuides(snapResult.alignmentGuides || {});
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
          
          {/* Editor guides (grid and margins) */}
          <EditorGuides showGrid={showGrid} showMargins={showMargins} />
          
          {/* Alignment guides for snapping feedback */}
          <AlignmentGuides 
            verticalGuide={alignmentGuides.vertical}
            horizontalGuide={alignmentGuides.horizontal}
            showGuides={enableSnapping}
          />
          
          <Picture
              key={pictures[0].id}
              shapeProps={pictures[0]}
              isSelected={selectedId === pictures[0].id}
              onSelect={() => selectShape(pictures[0].id)}
              onChange={(newAttrs) => {
                setPictures((prev) => prev.map((p) => (p.id === pictures[0].id ? { ...p, ...newAttrs } : p)));
              }}
              otherShapes={pictures.filter((p) => p.id !== pictures[0].id)}
              enableSnapping={enableSnapping}
              onSnapChange={handleSnapChange}
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
              otherShapes={pictures.filter((p) => p.id !== pic.id)}
              enableSnapping={enableSnapping}
              onSnapChange={handleSnapChange}
            />
          ))}
        </KLayer>
      </KStage>
      <div className='flex flex-1 flex-col gap-2'>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-12 h-8 rounded border"
              title="Background Color"
            />
            <button onClick={handleExport} className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Save Template
            </button>
            <button 
              onClick={() => distributeEvenly(2)} 
              className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600">
              Distribute Evenly
            </button>
            <button 
              onClick={() => getPosition()} 
              className="px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
              Get Images Position
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => setShowGrid(!showGrid)} 
              className={`px-3 py-2 rounded ${showGrid ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {showGrid ? 'Hide Grid' : 'Show Grid'}
            </button>
            <button 
              onClick={() => setShowMargins(!showMargins)} 
              className={`px-3 py-2 rounded ${showMargins ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {showMargins ? 'Hide Margins' : 'Show Margins'}
            </button>
            <button 
              onClick={() => setEnableSnapping(!enableSnapping)} 
              className={`px-3 py-2 rounded ${enableSnapping ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {enableSnapping ? 'Disable Snapping' : 'Enable Snapping'}
            </button>
          </div>
        </div>

        <div>
            <p>{JSON.stringify(pictures, null, 2)}</p>
            {image && <img src={image} className='w-full'/>}
        </div>
      </div>
    </div>  
  );
};
