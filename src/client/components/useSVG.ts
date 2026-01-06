import { useState, useEffect } from 'react';

export const useSVG = (text: string, fontId: string | undefined) => {
  const [baseSVG, setBaseSVG] = useState<string | null>(null);

  useEffect(() => {
    if (!text || !fontId) return;

    const fetchSVG = async () => {
      const response = await fetch(`/api/svg?text=${encodeURIComponent(text)}&fontId=${encodeURIComponent(fontId)}`);
      if (response.ok) {
        const svg = await response.text();
        setBaseSVG(svg);
      }
    };

    fetchSVG();
  }, [text, fontId]);

  return { baseSVG };
};
