import { Button } from '../ui/button';
import type { TemplateType } from './app';

interface ReviewScreenProps {
  template: TemplateType;
  background: string;
  photos: string[];
  onRetake: (photoIndex: number) => void;
  onConfirm: () => void;
}

export function ReviewScreen({ 
  template, 
  background, 
  photos, 
  onRetake, 
  onConfirm 
}: ReviewScreenProps) {
  const getBackgroundStyle = (bg: string) => {
    switch (bg) {
      case 'white': return 'bg-white';
      case 'black': return 'bg-black';
      case 'blue': return 'bg-blue-500';
      case 'purple': return 'bg-purple-500';
      case 'pink': return 'bg-pink-500';
      case 'green': return 'bg-emerald-500';
      case 'gradient-sunset': return 'bg-gradient-to-br from-orange-400 to-pink-600';
      case 'gradient-ocean': return 'bg-gradient-to-br from-blue-400 to-cyan-600';
      case 'gradient-forest': return 'bg-gradient-to-br from-green-400 to-emerald-600';
      default: return 'bg-white';
    }
  };

  const renderFinalComposition = () => {
    const backgroundClass = getBackgroundStyle(background);
    
    switch (template) {
      case 'single':
        return (
          <div className={`w-full h-full ${backgroundClass} rounded-lg p-4 flex items-center justify-center`}>
            <div 
              className="w-full h-full bg-blue-400 rounded cursor-pointer hover:ring-4 hover:ring-yellow-400 transition-all flex items-center justify-center text-white text-lg"
              onClick={() => onRetake(0)}
            >
              Photo 1 - Click to retake
            </div>
          </div>
        );
      
      case '2-strip':
        return (
          <div className={`w-full h-full ${backgroundClass} rounded-lg p-4 flex flex-col gap-4`}>
            {photos.slice(0, 2).map((_, i) => (
              <div 
                key={i}
                className="flex-1 bg-blue-400 rounded cursor-pointer hover:ring-4 hover:ring-yellow-400 transition-all flex items-center justify-center text-white"
                onClick={() => onRetake(i)}
              >
                Photo {i + 1} - Click to retake
              </div>
            ))}
          </div>
        );
      
      case '4-strip':
        return (
          <div className={`w-full h-full ${backgroundClass} rounded-lg p-4 flex flex-col gap-2`}>
            {photos.slice(0, 4).map((_, i) => (
              <div 
                key={i}
                className="flex-1 bg-blue-400 rounded cursor-pointer hover:ring-4 hover:ring-yellow-400 transition-all flex items-center justify-center text-white text-sm"
                onClick={() => onRetake(i)}
              >
                Photo {i + 1} - Click to retake
              </div>
            ))}
          </div>
        );
      
      case 'collage':
        return (
          <div className={`w-full h-full ${backgroundClass} rounded-lg p-4 grid grid-cols-2 gap-2`}>
            {photos.slice(0, 4).map((_, i) => (
              <div 
                key={i}
                className="bg-blue-400 rounded cursor-pointer hover:ring-4 hover:ring-yellow-400 transition-all flex items-center justify-center text-white text-sm"
                onClick={() => onRetake(i)}
              >
                Photo {i + 1} - Click to retake
              </div>
            ))}
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
          Review Your Photos
        </h1>
        <p className="text-xl text-gray-600 text-center mt-2">
          Click any photo to retake it, or confirm to continue
        </p>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md mx-auto">
          <div className="aspect-[3/4] shadow-2xl">
            {renderFinalComposition()}
          </div>
          
          {/* Instructions */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">
              Your photo strip is ready!
            </p>
            <p className="text-sm text-gray-500">
              Click on any photo above to retake it
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-shrink-0 flex justify-center gap-6 px-8 py-8 border-t bg-gray-50">
        <Button
          onClick={() => onRetake(0)}
          variant="outline"
          className="text-lg px-8 py-6 rounded-xl border-red-300 text-red-600 hover:bg-red-50"
        >
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z"/>
          </svg>
          Retake Photos
        </Button>

        <Button
          onClick={onConfirm}
          className="bg-green-500 hover:bg-green-600 text-white text-xl px-12 py-6 rounded-xl shadow-lg transform transition-all hover:scale-105"
        >
          <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
          </svg>
          Confirm & Continue
        </Button>
      </div>
    </div>
  );
}