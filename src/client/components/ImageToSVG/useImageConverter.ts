import { useState, useCallback } from 'react';

export interface ImageConversionResult {
  baseSVG: string;
  tightOutlineSVG: string;
}

export const useImageConverter = () => {
  const [result, setResult] = useState<ImageConversionResult | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

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

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConverting(false);
    }
  }, []);

  return {
    result,
    svgResult: result?.baseSVG || null,
    tightOutlineSVG: result?.tightOutlineSVG || null,
    isConverting,
    error,
    convertImage,
    reset
  };
};
