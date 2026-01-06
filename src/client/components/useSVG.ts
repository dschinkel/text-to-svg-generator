import { useState, useEffect } from 'react';

export const useSVG = (text: string, fontId: string | undefined) => {
  const [baseSVG, setBaseSVG] = useState<string | null>(null);

  useEffect(() => {
    if (!text) {
      setBaseSVG(null);
      return;
    }

    if (text !== 'DEBUG' && !fontId) {
      setBaseSVG(null);
      return;
    }

    const fetchSVG = async () => {
      try {
        const url = text === 'DEBUG' 
          ? `/api/svg?text=DEBUG` 
          : `/api/svg?text=${encodeURIComponent(text)}&fontId=${encodeURIComponent(fontId!)}`;
        
        const response = await fetch(url);
        if (response.ok) {
          const svg = await response.text();
          setBaseSVG(svg);
        } else {
          setBaseSVG(null);
        }
      } catch (error) {
        console.error('Error fetching SVG:', error);
        setBaseSVG(null);
      }
    };

    fetchSVG();
  }, [text, fontId]);

  return { baseSVG };
};
