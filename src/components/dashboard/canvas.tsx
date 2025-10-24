import { Rect } from 'react-konva';
import { useRef, useState, useCallback, useEffect } from 'react';
import { PAPER_HEIGHT, PAPER_WIDTH, Picture } from '../editor-poc';
import { KLayer, KStage } from '../editor-poc/lib';
import { useEditorStore } from '@/lib/zustand/feature/editor';
import { ZoomToolbar } from './zoom-toolbar';

function Canvas() {
  const stageRef = useRef<any>(null);

  // 👇 Zoom and pan states
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const {
    bgColor,
    pictureTemplate,
    selectedId,
    setSelectedId,
    bgPicture,
    enableSnapping,
    setOnChangePicture,
    setOnChangeBgPicture,
  } = useEditorStore((state) => state);

  // 👇 Detect spacebar press/release
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const checkDeselect = (e: any) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) setSelectedId(null);
  };

  // 👇 Zoom (wheel)
  const handleWheelZoom = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      const scaleBy = 1.1;
      const direction = e.deltaY > 0 ? -1 : 1;
      const newZoom = direction > 0 ? zoom * scaleBy : zoom / scaleBy;
      const clamped = Math.min(3, Math.max(0.5, newZoom));
      setZoom(clamped);
    },
    [zoom]
  );

  // 👇 Mouse drag for panning (only when Spacebar is pressed)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSpacePressed) return;
    setIsDragging(true);
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !lastPos) return;
    const dx = e.clientX - lastPos.x;
    const dy = e.clientY - lastPos.y;
    setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setLastPos(null);
  };

  return (
    <>
    {/* Zoom controls */}
    <ZoomToolbar zoom={zoom} setZoom={setZoom} />
    <div
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
        transformOrigin: 'center center',
        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
        cursor: isSpacePressed ? (isDragging ? 'grabbing' : 'grab') : 'default',
      }}
      className="min-h-full flex flex-col items-center gap-2 w-full h-full overflow-hidden select-none"
      onWheel={handleWheelZoom}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >

      {/* Paper container */}
      <div className="shadow-lg w-fit mx-auto">
        <KStage
          width={PAPER_WIDTH}
          height={PAPER_HEIGHT}
          ref={stageRef}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
        >
          <KLayer>
            <Rect width={PAPER_WIDTH} height={PAPER_HEIGHT} fill={bgColor} />

            {bgPicture && (
              <Picture
                key={pictureTemplate[0].id}
                shapeProps={pictureTemplate[0]}
                isSelected={selectedId === pictureTemplate[0].id}
                onSelect={() => setSelectedId(pictureTemplate[0].id)}
                onChange={(newAttrs) => setOnChangeBgPicture(newAttrs)}
                otherShapes={pictureTemplate.filter(
                  (p) => p.id !== pictureTemplate[0].id
                )}
                enableSnapping={enableSnapping}
              />
            )}

            {pictureTemplate
              .filter((e) => e.id !== 'pic-background')
              .map((pic) => (
                <Picture
                  key={pic.id}
                  shapeProps={pic}
                  isSelected={selectedId === pic.id}
                  onSelect={() => setSelectedId(pic.id)}
                  onChange={(newAttrs) => setOnChangePicture(newAttrs)}
                  otherShapes={pictureTemplate.filter((p) => p.id !== pic.id)}
                  enableSnapping={enableSnapping}
                />
              ))}
          </KLayer>
        </KStage>
      </div>
    </div>
    </>
    
  );
}

export default Canvas;
