import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import Canvas from './canvas';
import { useEditorStore } from '@/lib/zustand/feature/editor';

const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#10B981' },
  { name: 'Yellow', value: '#F59E0B' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Pink', value: '#d28383' },
  
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
  const {setBgColor} = useEditorStore((state) => state);
  const [textElements, setTextElements] = useState<TextElement[]>([
    { id: '1', text: 'Your Event Name', color: '#000000', x: 50, y: 30 }
  ]);

  useEffect((() => {
    setBgColor(backgroundColor)
  }), [backgroundColor])

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
    <div className="!min-h-screen overflow-hidden flex flex-col bg-white ">
      {/* Header */}
      <header className="z-50 bg-white border-b border-gray-300 py-4">
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
      <div className="flex-1 flex min-h-full">
        {/* Left Toolbar */}
        <aside className="z-50 w-64 border-r border-gray-300 p-6 bg-white">
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
        <main className="max-h-full flex-1 bg-gray-100">
          <div className="max-w-4xl mx-auto">
            <Canvas />
            {/* Canvas Info */}
            {/* <div className="mt-4 text-center text-gray-600">
              <p>4:3 Aspect Ratio • Photo Booth Template</p>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
}
