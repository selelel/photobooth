import { useState } from 'react';
import { AttractScreen } from './AttractScreen';
import { ChooseTemplateScreen } from './ChooseTemplateScreen';
import { ChooseBackgroundScreen } from './ChooseBackgroundScreen';
import { CaptureScreen } from './CaptureScreen';
import { ReviewScreen } from './ReviewScreen';
import { PrintScreen } from './PrintScreen';

export type ScreenType = 'attract' | 'template' | 'background' | 'capture' | 'review' | 'print';

export type TemplateType = 'single' | '2-strip' | '4-strip' | 'collage';

export interface PhotoBoothState {
  currentScreen: ScreenType;
  selectedTemplate: TemplateType | null;
  selectedBackground: string | null;
  capturedPhotos: string[];
  currentPhotoIndex: number;
}

export default function App() {
  const [state, setState] = useState<PhotoBoothState>({
    currentScreen: 'attract',
    selectedTemplate: null,
    selectedBackground: null,
    capturedPhotos: [],
    currentPhotoIndex: 0,
  });

  const updateState = (updates: Partial<PhotoBoothState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const navigateToScreen = (screen: ScreenType) => {
    updateState({ currentScreen: screen });
  };

  const resetFlow = () => {
    setState({
      currentScreen: 'attract',
      selectedTemplate: null,
      selectedBackground: null,
      capturedPhotos: [],
      currentPhotoIndex: 0,
    });
  };

  const renderCurrentScreen = () => {
    switch (state.currentScreen) {
      case 'attract':
        return <AttractScreen onStart={() => navigateToScreen('template')} />;
      case 'template':
        return (
          <ChooseTemplateScreen
            selectedTemplate={state.selectedTemplate}
            onTemplateSelect={(template) => updateState({ selectedTemplate: template })}
            onBack={() => navigateToScreen('attract')}
            onNext={() => navigateToScreen('background')}
          />
        );
      case 'background':
        return (
          <ChooseBackgroundScreen
            selectedBackground={state.selectedBackground}
            onBackgroundSelect={(background) => updateState({ selectedBackground: background })}
            onBack={() => navigateToScreen('template')}
            onNext={() => navigateToScreen('capture')}
          />
        );
      case 'capture':
        return (
          <CaptureScreen
            template={state.selectedTemplate!}
            background={state.selectedBackground!}
            capturedPhotos={state.capturedPhotos}
            currentPhotoIndex={state.currentPhotoIndex}
            onPhotoCapture={(photos, nextIndex) => 
              updateState({ capturedPhotos: photos, currentPhotoIndex: nextIndex })
            }
            onComplete={() => navigateToScreen('review')}
          />
        );
      case 'review':
        return (
          <ReviewScreen
            template={state.selectedTemplate!}
            background={state.selectedBackground!}
            photos={state.capturedPhotos}
            onRetake={(photoIndex) => {
              updateState({ currentPhotoIndex: photoIndex, currentScreen: 'capture' });
            }}
            onConfirm={() => navigateToScreen('print')}
          />
        );
      case 'print':
        return (
          <PrintScreen
            template={state.selectedTemplate!}
            background={state.selectedBackground!}
            photos={state.capturedPhotos}
            onStartOver={resetFlow}
          />
        );
      default:
        return <AttractScreen onStart={() => navigateToScreen('template')} />;
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 relative overflow-hidden">
      {/* Event Logo - Always visible in top-right */}
      <div className="absolute top-6 right-6 z-50">
        <div className="bg-white rounded-lg px-4 py-2 shadow-lg">
          <span className="text-lg font-medium text-gray-800">Event Logo</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full h-full">
        {renderCurrentScreen()}
      </div>
    </div>
  );
}