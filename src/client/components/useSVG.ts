import { useState, useEffect } from 'react';

export const useSVG = (text: string, fontId: string | undefined) => {
  const [baseSVG, setBaseSVG] = useState<string | null>(null);
  const [tightOutlineSVG, setTightOutlineSVG] = useState<string | null>(null);

  useEffect(() => {
    if (!text) {
      setBaseSVG(null);
      setTightOutlineSVG(null);
      return;
    }

    if (text !== 'DEBUG' && !fontId) {
      setBaseSVG(null);
      setTightOutlineSVG(null);
      return;
    }

    const fetchSVG = async (type: 'base' | 'tight') => {
      try {
        const baseUrl = text === 'DEBUG' 
          ? `/api/svg?text=DEBUG` 
          : `/api/svg?text=${encodeURIComponent(text)}&fontId=${encodeURIComponent(fontId!)}`;
        
        const url = `${baseUrl}&type=${type}`;
        
        const response = await fetch(url);
        if (response.ok) {
          const svg = await response.text();
          if (type === 'base') setBaseSVG(svg);
          if (type === 'tight') setTightOutlineSVG(svg);
        } else {
          if (type === 'base') setBaseSVG(null);
          if (type === 'tight') setTightOutlineSVG(null);
        }
      } catch (error) {
        console.error(`Error fetching ${type} SVG:`, error);
        if (type === 'base') setBaseSVG(null);
        if (type === 'tight') setTightOutlineSVG(null);
      }
    };

    fetchSVG('base');
    fetchSVG('tight');
  }, [text, fontId]);

  return { baseSVG, tightOutlineSVG };
};
