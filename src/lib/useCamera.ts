import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseCameraOptions {
  facingMode?: 'user' | 'environment'
  audio?: boolean
}

export interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement>
  isActive: boolean
  error: string | null
  permission: PermissionState | 'unsupported' | null
  requestPermission: (opts?: UseCameraOptions) => Promise<PermissionState | 'unsupported'>
  start: (opts?: UseCameraOptions) => Promise<void>
  stop: () => void
  capture: () => string | null
}

export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [permission, setPermission] = useState<PermissionState | 'unsupported' | null>(null)

  const start = useCallback(async (opts?: UseCameraOptions) => {
    try {
      if (!window.isSecureContext) {
        setError('Camera requires HTTPS or http://localhost.')
      }
      const constraints: MediaStreamConstraints = {
        video: { facingMode: opts?.facingMode ?? 'user' },
        audio: opts?.audio ?? false,
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('MediaDevices.getUserMedia is not supported')
      }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      if (videoRef.current) {
        ;(videoRef.current as unknown as { srcObject: MediaStream }).srcObject = stream
        videoRef.current.muted = true
        await new Promise<void>((resolve) => {
          if (!videoRef.current) return resolve()
          const handler = () => {
            if (!videoRef.current) return resolve()
            videoRef.current.play().catch(() => {})
            videoRef.current && videoRef.current.removeEventListener('loadedmetadata', handler)
            resolve()
          }
          if (videoRef.current.readyState >= 1) handler()
          else videoRef.current.addEventListener('loadedmetadata', handler)
        })
      }
      setIsActive(true)
      setError(null)
    } catch (err) {
       
      console.error('Failed to start camera:', err)
      setError(err instanceof Error ? err.message : 'Failed to start camera')
      setIsActive(false)
    }
  }, [])

  const stop = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    setIsActive(false)
  }, [])

  const capture = useCallback((): string | null => {
    const video = videoRef.current
    if (!video) return null
    const width = video.videoWidth
    const height = video.videoHeight
    if (!width || !height) return null
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(video, 0, 0, width, height)
    return canvas.toDataURL('image/png')
  }, [])

  useEffect(() => {
    // Initialize permission status if the Permissions API is available
    const initPermission = async () => {
      try {
        const navAny = navigator as any
        if (navAny.permissions && typeof navAny.permissions.query === 'function') {
          const status = (await navAny.permissions.query({ name: 'camera' as any })) as PermissionStatus
          setPermission(status.state)
          status.onchange = () => setPermission(status.state)
        } else {
          setPermission('unsupported')
        }
      } catch {
        setPermission('unsupported')
      }
    }
    initPermission()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
    }
  }, [])

  const requestPermission = useCallback(async (opts?: UseCameraOptions): Promise<PermissionState | 'unsupported'> => {
    try {
      const constraints: MediaStreamConstraints = {
        video: { facingMode: opts?.facingMode ?? 'user' },
        audio: opts?.audio ?? false,
      }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermission('unsupported')
        return 'unsupported'
      }
      const tempStream = await navigator.mediaDevices.getUserMedia(constraints)
      tempStream.getTracks().forEach((t) => t.stop())
      try {
        const navAny = navigator as any
        if (navAny.permissions && typeof navAny.permissions.query === 'function') {
          const status: PermissionStatus = await navAny.permissions.query({ name: 'camera' as any })
          setPermission(status.state)
          return status.state
        }
      } catch {
        // ignore and fall through
      }
      setPermission('unsupported')
      return 'unsupported'
    } catch {
      try {
        const navAny = navigator as any
        if (navAny.permissions && typeof navAny.permissions.query === 'function') {
          const status: PermissionStatus = await navAny.permissions.query({ name: 'camera' as any })
          setPermission(status.state)
          return status.state
        }
      } catch {
        // ignore
      }
      setPermission('unsupported')
      return 'unsupported'
    }
  }, [])

  return {
    videoRef: videoRef as React.RefObject<HTMLVideoElement>,
    isActive,
    error,
    permission,
    requestPermission,
    start,
    stop,
    capture
  }
}
