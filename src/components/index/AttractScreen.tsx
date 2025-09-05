import { Button } from "../ui/button";


interface AttractScreenProps {
  onStart: () => void;
}

export function AttractScreen({ onStart }: AttractScreenProps) {
  return (
    <div className="w-full h-full relative bg-black flex items-center justify-center">
      {/* Mock Camera Feed Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 opacity-70"></div>
      
      {/* Camera Feed Placeholder */}
      <div className="absolute inset-0 flex items-center justify-center text-white/30 text-2xl">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-4 rounded-full border-4 border-white/20 flex items-center justify-center">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.65-.07-.97l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.12.22-.07.49.12.64L4.57 11c-.04.32-.07.65-.07.97c0 .33.03.65.07.97L2.46 14.6c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.31.61.22l2.49-1c.52.39 1.06.73 1.69.98l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.25 1.17-.59 1.69-.98l2.49 1c.22.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.63Z"/>
            </svg>
          </div>
          <p>Camera Feed</p>
        </div>
      </div>

      {/* Start Button */}
      <div className="relative z-10 text-center">
        <h1 className="text-white text-6xl font-bold mb-4 drop-shadow-lg">
          Photo Booth
        </h1>
        <p className="text-white/90 text-2xl mb-12 drop-shadow">
          Create amazing memories with your friends!
        </p>
        
        <Button
          onClick={onStart}
          className="bg-green-500 hover:bg-green-600 text-white text-2xl px-16 py-8 rounded-2xl shadow-2xl transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <svg className="w-8 h-8 mr-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Click to Start
        </Button>
      </div>
    </div>
  );
}