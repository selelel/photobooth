import { useState, useEffect } from 'react';

// Custom hook for loading images
export function useImage(url: string | null) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [status, setStatus] = useState<'loading' | 'loaded' | 'failed'>('loading');

  useEffect(() => {
    if (!url) return;
    const img = new window.Image();
    img.crossOrigin = 'Anonymous'; // allows using cloud images (e.g. Supabase)
    img.src = url;

    img.onload = () => {
      setImage(img);
      setStatus('loaded');
    };
    img.onerror = () => setStatus('failed');

    return () => {
      setImage(null);
      setStatus('loading');
    };
  }, [url]);

  return [image, status] as const;
}
