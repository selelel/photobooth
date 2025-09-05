import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface ChooseBackgroundScreenProps {
  selectedBackground: string | null;
  onBackgroundSelect: (background: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const backgrounds = [
  { id: 'white', name: 'Clean White', color: '#ffffff', preview: 'bg-white' },
  { id: 'black', name: 'Classic Black', color: '#000000', preview: 'bg-black' },
  { id: 'blue', name: 'Ocean Blue', color: '#3b82f6', preview: 'bg-blue-500' },
  { id: 'purple', name: 'Royal Purple', color: '#8b5cf6', preview: 'bg-purple-500' },
  { id: 'pink', name: 'Blush Pink', color: '#ec4899', preview: 'bg-pink-500' },
  { id: 'green', name: 'Forest Green', color: '#10b981', preview: 'bg-emerald-500' },
  { id: 'gradient-sunset', name: 'Sunset Gradient', color: 'linear-gradient', preview: 'bg-gradient-to-br from-orange-400 to-pink-600' },
  { id: 'gradient-ocean', name: 'Ocean Gradient', color: 'linear-gradient', preview: 'bg-gradient-to-br from-blue-400 to-cyan-600' },
  { id: 'gradient-forest', name: 'Forest Gradient', color: 'linear-gradient', preview: 'bg-gradient-to-br from-green-400 to-emerald-600' },
  { id: 'pattern-dots', name: 'Polka Dots', color: 'pattern', preview: 'bg-white' },
  { id: 'pattern-stripes', name: 'Diagonal Stripes', color: 'pattern', preview: 'bg-white' },
  { id: 'pattern-hearts', name: 'Love Hearts', color: 'pattern', preview: 'bg-pink-50' },
];

export function ChooseBackgroundScreen({ 
  selectedBackground, 
  onBackgroundSelect, 
  onBack, 
  onNext 
}: ChooseBackgroundScreenProps) {
  const renderPattern = (id: string) => {
    switch (id) {
      case 'pattern-dots':
        return (
          <div className="w-full h-full bg-blue-500 relative overflow-hidden">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle, white 20%, transparent 20%)',
              backgroundSize: '20px 20px'
            }}></div>
          </div>
        );
      case 'pattern-stripes':
        return (
          <div className="w-full h-full bg-purple-500 relative overflow-hidden">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(45deg, white 0px, white 10px, transparent 10px, transparent 20px)'
            }}></div>
          </div>
        );
      case 'pattern-hearts':
        return (
          <div className="w-full h-full bg-pink-500 relative overflow-hidden flex items-center justify-center">
            <div className="text-white text-4xl">♥</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-white flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-8 py-6 border-b">
        <h1 className="text-4xl font-bold text-gray-800 text-center">
          Choose Your Background
        </h1>
        <p className="text-xl text-gray-600 text-center mt-2">
          Select a background for your photo strip
        </p>
      </div>

      {/* Background Grid */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-w-7xl mx-auto">
          {backgrounds.map((background) => (
            <Card
              key={background.id}
              className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-lg ${
                selectedBackground === background.id
                  ? 'ring-4 ring-blue-500 shadow-lg transform scale-105'
                  : 'hover:shadow-md'
              }`}
              onClick={() => onBackgroundSelect(background.id)}
            >
              <div className="aspect-square mb-3 rounded-lg overflow-hidden border">
                {background.color === 'pattern' ? (
                  renderPattern(background.id)
                ) : (
                  <div className={`w-full h-full ${background.preview}`}></div>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-800 text-center">
                {background.name}
              </h3>
            </Card>
          ))}
        </div>

        {/* Upload Option */}
        <div className="mt-8 max-w-md mx-auto">
          <Card className="p-6 border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-colors">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Upload Custom Background</h3>
              <p className="text-sm text-gray-600">Click to upload your own image</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-shrink-0 flex justify-between items-center px-8 py-6 border-t bg-gray-50">
        <Button
          onClick={onBack}
          variant="outline"
          className="text-lg px-8 py-6 rounded-xl"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
          Back
        </Button>

        <Button
          onClick={onNext}
          disabled={!selectedBackground}
          className="bg-green-500 hover:bg-green-600 text-lg px-8 py-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/>
          </svg>
        </Button>
      </div>
    </div>
  );
}