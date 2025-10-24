import { useState } from 'react';
import { Button } from '../ui/button';

const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#EC4899' },
];

interface TextElement {
  id: string;
  text: string;
  color: string;
  x: number;
  y: number;
}

export function Editor() {
  const [showGrid, setShowGrid] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [textElements, setTextElements] = useState<TextElement[]>([
    { id: '1', text: 'Your Event Name', color: '#000000', x: 50, y: 30 }
  ]);

  const addText = () => {
    const newElement: TextElement = {
      id: Date.now().toString(),
      text: 'New Text',
      color: '#000000',
      x: 50,
      y: 50
    };
    setTextElements([...textElements, newElement]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="border-b border-gray-300 py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="text-black">Photoble Editor</div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="rounded-lg border-gray-300 text-black hover:bg-gray-100"
            >
              Save Template
            </Button>
            <Button className="rounded-lg bg-black text-white hover:bg-gray-800">
              Export
            </Button>
          </div>
        </div>
      </header>

      {/* Main Editor Area */}
      <div className="flex-1 flex">
        {/* Left Toolbar */}
        <aside className="w-64 border-r border-gray-300 p-6 bg-white">
          <div className="space-y-6">
            {/* Background Color */}
            <div>
              <h3 className="text-black mb-3">Background</h3>
              <div className="grid grid-cols-4 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setBackgroundColor(color.value)}
                    className="w-12 h-12 rounded-lg border-2 hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: color.value,
                      borderColor: backgroundColor === color.value ? '#000000' : '#D1D5DB'
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* <Separator className="bg-gray-300" /> */}

            {/* Text Tools */}
            <div>
              <h3 className="text-black mb-3">Text</h3>
              <Button 
                onClick={addText}
                variant="outline" 
                className="w-full rounded-lg border-gray-300 text-black hover:bg-gray-100"
              >
                Add Text
              </Button>
            </div>

            {/* <Separator className="bg-gray-300" /> */}

            {/* Grid Toggle */}
            <div>
              <h3 className="text-black mb-3">View</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-black">Show Grid</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Canvas Area */}
        <main className="flex-1 p-12 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div 
              className="relative aspect-[4/3] border-2 border-gray-300 rounded-lg overflow-hidden shadow-lg"
              style={{ backgroundColor }}
            >
              {/* Grid Overlay */}
              {showGrid && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px'
                  }}
                />
              )}

              {/* Text Elements */}
              {textElements.map((element) => (
                <div
                  key={element.id}
                  className="absolute cursor-move"
                  style={{
                    left: `${element.x}%`,
                    top: `${element.y}%`,
                    transform: 'translate(-50%, -50%)',
                    color: element.color
                  }}
                >
                  <div className="px-4 py-2 hover:outline hover:outline-2 hover:outline-blue-500 rounded">
                    {element.text}
                  </div>
                </div>
              ))}

              {/* Center Guidelines */}
              {showGrid && (
                <>
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-red-400 opacity-30" />
                  <div className="absolute top-1/2 left-0 right-0 h-px bg-red-400 opacity-30" />
                </>
              )}
            </div>

            {/* Canvas Info */}
            <div className="mt-4 text-center text-gray-600">
              <p>4:3 Aspect Ratio • Photo Booth Template</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
