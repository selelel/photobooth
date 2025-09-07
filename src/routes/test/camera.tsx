import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useCamera } from '../../lib/useCamera'

export const Route = createFileRoute('/test/camera')({
  component: RouteComponent,
})

function RouteComponent() {
  const { videoRef, error, start, stop, capture, isActive, permission, requestPermission } = useCamera()
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)

  useEffect(() => {
    start({ facingMode: 'user', audio: false })
    return () => stop()
  }, [start, stop])

  const handleCapture = async () => {
    const dataUrl = capture()
    if (dataUrl) setPhotoUrl(dataUrl)
    console.log(dataUrl)
  }

  return (
    <div className="w-full h-full p-6 flex gap-6">
      <div className="flex-1 bg-black rounded-lg overflow-hidden relative">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60">
            <div className="text-white text-center px-4">
              <p className="font-semibold">{error}</p>
              <p className="text-sm opacity-80">Try using HTTPS or localhost and allow permissions.</p>
            </div>
          </div>
        )}
      </div>

      <div className="w-96 flex flex-col gap-4">
        <div className="text-sm text-gray-700">
          Permission: <span className="font-medium">{permission ?? 'checking...'}</span>
        </div>
        <button onClick={() => requestPermission({ facingMode: 'user', audio: false })} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded">
          Request Permission
        </button>
        <button onClick={handleCapture} disabled={!isActive} className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold px-4 py-3 rounded">
          Capture Photo
        </button>
        <div className="aspect-[3/4] bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
          {photoUrl ? (
            <img src={photoUrl} alt="Captured" className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-500">No photo yet</span>
          )}
        </div>
      </div>
    </div>
  )
}
