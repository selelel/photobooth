import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import type { TemplateType } from './app';
import { useCamera } from '@/lib/useCamera';

interface CaptureScreenProps {
  template: TemplateType;
  background: string;
  capturedPhotos: string[];
  currentPhotoIndex: number;
  onPhotoCapture: (photos: string[], nextIndex: number) => void;
  onComplete: () => void;
}

export function CaptureScreen({ 
  template, 
  capturedPhotos, 
  currentPhotoIndex, 
  onPhotoCapture, 
  onComplete 
}: CaptureScreenProps) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  /**** Camera ****/
  const { videoRef, error, start, stop, capture } = useCamera()

  useEffect(() => {
    start({ facingMode: 'user', audio: false })
    return () => stop()
  }, [start, stop])

  const getPhotosNeeded = (template: TemplateType): number => {
    switch (template) {
      case 'single': return 1;
      case '2-strip': return 2;
      case '4-strip': return 4;
      case 'collage': return 4;
      default: return 1;
    }
  };

  const photosNeeded = getPhotosNeeded(template);
  const isLastPhoto = currentPhotoIndex >= photosNeeded - 1;

  const startCountdown = () => {
    setCountdown(3);
  };

  // Start/stop camera lifecycle
  useEffect(() => {
    start({ facingMode: 'user', audio: false })
    return () => stop()
  }, [start, stop])

  // Reflect hook error in local UI state
  useEffect(() => {
    setCameraError(error)
  }, [error])

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Capture photo
      setIsCapturing(true);
      try {
        const dataUrl = capture();
        if (!dataUrl) throw new Error('Failed to capture');
        const updatedPhotos = [...capturedPhotos];
        updatedPhotos[currentPhotoIndex] = dataUrl;

        setIsCapturing(false);
        setCountdown(null);

        if (isLastPhoto) {
          onPhotoCapture(updatedPhotos, currentPhotoIndex + 1);
          setTimeout(() => onComplete(), 500);
        } else {
          onPhotoCapture(updatedPhotos, currentPhotoIndex + 1);
        }
      } catch (err) {
         
        console.error("Failed to capture image:", err);
        setIsCapturing(false);
        setCountdown(null);
      }
    }
  }, [countdown, currentPhotoIndex, capturedPhotos, isLastPhoto, onPhotoCapture, onComplete]);

  const renderPreviewLayout = () => {
    const photos = Array.from({ length: photosNeeded }, (_, i) => 
      capturedPhotos[i] || null
    );

    switch (template) {
      case 'single':
        return (
          <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            {photos[0] ? (
              <img src={photos[0] as string} alt="Photo 1" className="w-full h-full object-cover" />
            ) : (
              <div className="text-gray-500 text-lg">Photo will appear here</div>
            )}
          </div>
        );
      
      case '2-strip':
        return (
          <div className="w-full h-full bg-gray-200 rounded-lg p-2 flex flex-col gap-2">
            {photos.map((photo, i) => (
              <div key={i} className={`flex-1 rounded overflow-hidden ${
                photo ? 'bg-black' : 'bg-gray-300 text-gray-500'
              } flex items-center justify-center`}>
                {photo ? (
                  <img src={photo as string} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  `Photo ${i + 1}`
                )}
              </div>
            ))}
          </div>
        );
      
      case '4-strip':
        return (
          <div className="w-full h-full bg-gray-200 rounded-lg p-2 flex flex-col gap-1">
            {photos.map((photo, i) => (
              <div key={i} className={`flex-1 rounded overflow-hidden ${
                photo ? 'bg-black' : 'bg-gray-300 text-gray-500'
              } flex items-center justify-center text-sm`}>
                {photo ? (
                  <img src={photo as string} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  `Photo ${i + 1}`
                )}
              </div>
            ))}
          </div>
        );
      
      case 'collage':
        return (
          <div className="w-full h-full bg-gray-200 rounded-lg p-2 grid grid-cols-2 gap-1">
            {photos.map((photo, i) => (
              <div key={i} className={`rounded overflow-hidden ${
                photo ? 'bg-black' : 'bg-gray-300 text-gray-500'
              } flex items-center justify-center text-sm`}>
                {photo ? (
                  <img src={photo as string} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                ) : (
                  `Photo ${i + 1}`
                )}
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full bg-black flex">
      {/* Live Camera Feed */}
      <div className="flex-1 relative">
        {/* Live Camera Feed */}
        <div className="w-full h-full bg-black relative">
          <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
          {cameraError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <div className="text-white text-center px-4">
                <p className="font-semibold">{cameraError}</p>
                <p className="text-sm opacity-80">Try using HTTPS or localhost and allow permissions.</p>
              </div>
            </div>
          )}

          {/* Countdown Overlay */}
          {countdown !== null && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-white text-9xl font-bold animate-pulse">
                {countdown > 0 ? countdown : '📸'}
              </div>
            </div>
          )}

          {/* Capture Flash */}
          {isCapturing && (
            <div className="absolute inset-0 bg-white animate-pulse"></div>
          )}

          {/* Progress Indicator */}
          <div className="absolute top-6 left-6 bg-black/50 text-white px-4 py-2 rounded-lg">
            <span className="text-lg font-medium">
              Photo {currentPhotoIndex + 1} of {photosNeeded}
            </span>
          </div>

          {/* Capture Button */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <Button
              onClick={startCountdown}
              disabled={countdown !== null || isCapturing}
              className="bg-red-500 hover:bg-red-600 text-white text-xl px-8 py-8 rounded-full shadow-2xl disabled:opacity-50"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.65-.07-.97l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64L4.57 11c-.04.32-.07.65-.07.97c0 .33.03.65.07.97L2.46 14.6c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.31.61.22l2.49-1c.52.39 1.06.73 1.69.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.25 1.17-.59 1.69-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.63Z"/>
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Template Preview */}
      <div className="w-80 bg-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Photo Strip</h2>
        
        <div className="flex-1 max-w-xs mx-auto">
          <div className="aspect-[3/4]">
            {renderPreviewLayout()}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-2">
            {countdown !== null 
              ? 'Get ready!' 
              : isCapturing 
              ? 'Capturing...' 
              : `Ready for photo ${currentPhotoIndex + 1}`
            }
          </p>
          {countdown === null && !isCapturing && (
            <p className="text-sm text-gray-500">
              Click the red button to start the countdown
            </p>
          )}
        </div>
      </div>
    </div>
  );
}