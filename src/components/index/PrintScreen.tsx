import { useState } from 'react';
import { Button } from '../ui/button';
import type { TemplateType } from './app';

interface PrintScreenProps {
  template: TemplateType;
  background: string;
  photos: string[];
  onStartOver: () => void;
}

export function PrintScreen({ 
  template, 
  background, 
  photos, 
  onStartOver 
}: PrintScreenProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const [printComplete, setPrintComplete] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    
    // Simulate printing process
    setTimeout(() => {
      setIsPrinting(false);
      setPrintComplete(true);
    }, 3000);
  };

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
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center text-white text-lg shadow-inner">
              Your Amazing Photo
            </div>
          </div>
        );
      
      case '2-strip':
        return (
          <div className={`w-full h-full ${backgroundClass} rounded-lg p-4 flex flex-col gap-4`}>
            {photos.slice(0, 2).map((_, i) => (
              <div 
                key={i}
                className="flex-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center text-white shadow-inner"
              >
                Photo {i + 1}
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
                className="flex-1 bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center text-white text-sm shadow-inner"
              >
                Photo {i + 1}
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
                className="bg-gradient-to-br from-blue-400 to-blue-600 rounded flex items-center justify-center text-white text-sm shadow-inner"
              >
                Photo {i + 1}
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
          {printComplete ? 'Success!' : isPrinting ? 'Printing...' : 'Ready to Print'}
        </h1>
        <p className="text-xl text-gray-600 text-center mt-2">
          {printComplete 
            ? 'Your photo strip has been printed successfully!' 
            : isPrinting 
            ? 'Please wait while we print your photo strip' 
            : 'Your photo strip is ready to print'
          }
        </p>
      </div>

      {/* Preview and Status */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="max-w-md mx-auto text-center">
          {/* Final Photo Strip */}
          <div className={`aspect-[3/4] shadow-2xl mb-8 ${isPrinting ? 'animate-pulse' : ''}`}>
            {renderFinalComposition()}
          </div>

          {/* Status Messages */}
          {isPrinting && (
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <svg className="animate-spin w-8 h-8 text-blue-500 mr-3" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg text-blue-600">Printing in progress...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
            </div>
          )}

          {printComplete && (
            <div className="mb-6">
              <div className="flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"/>
                </svg>
                <span className="text-lg text-green-600">Print completed successfully!</span>
              </div>
              <p className="text-gray-600">
                Please collect your photo strip from the printer.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex-shrink-0 flex justify-center gap-6 px-8 py-8 border-t bg-gray-50">
        {!isPrinting && !printComplete && (
          <Button
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-600 text-white text-xl px-12 py-6 rounded-xl shadow-lg transform transition-all hover:scale-105"
          >
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z"/>
            </svg>
            Print Photo Strip
          </Button>
        )}

        {printComplete && (
          <Button
            onClick={onStartOver}
            className="bg-green-500 hover:bg-green-600 text-white text-xl px-12 py-6 rounded-xl shadow-lg transform transition-all hover:scale-105"
          >
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z"/>
            </svg>
            Start Over
          </Button>
        )}

        {isPrinting && (
          <Button
            disabled
            className="bg-gray-400 text-white text-xl px-12 py-6 rounded-xl cursor-not-allowed"
          >
            <svg className="animate-spin w-6 h-6 mr-3" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Printing...
          </Button>
        )}
      </div>
    </div>
  );
}