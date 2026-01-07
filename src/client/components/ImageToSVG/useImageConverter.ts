import { useState, useCallback } from 'react';

export const useImageConverter = () => {
  const [svgResult, setSvgResult] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertImage = useCallback(async (imageData: string) => {
    setIsConverting(true);
    setError(null);
    try {
      const response = await fetch('/api/image-to-svg', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData }),
      });

      if (!response.ok) {
        throw new Error('Failed to convert image');
      }

      const svg = await response.text();
      setSvgResult(svg);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConverting(false);
    }
  }, []);

  return {
    svgResult,
    isConverting,
    error,
    convertImage
  };
};
