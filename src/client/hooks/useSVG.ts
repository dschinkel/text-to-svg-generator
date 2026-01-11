import { useState, useEffect } from 'react';

export const useSVG = (text: string, fontId: string | undefined) => {
  const [baseSVG, setBaseSVG] = useState<string | null>(null);
  const [tightOutlineSVG, setTightOutlineSVG] = useState<string | null>(null);
  const [outerOutlineSVG, setOuterOutlineSVG] = useState<string | null>(null);

  useEffect(() => {
    if (!text || (text !== 'DEBUG' && !fontId)) {
      setBaseSVG(null);
      setTightOutlineSVG(null);
      setOuterOutlineSVG(null);
      return;
    }

    const fetchSVG = async (type: 'base' | 'tight' | 'outer') => {
      try {
        const baseUrl = text === 'DEBUG' 
          ? `/api/svg?text=DEBUG` 
          : `/api/svg?text=${encodeURIComponent(text)}&fontId=${encodeURIComponent(fontId!)}`;
        
        const url = `${baseUrl}&type=${type}`;
        
        const response = await fetch(url);
        const svg = response.ok ? await response.text() : null;

        const setters = {
          base: setBaseSVG,
          tight: setTightOutlineSVG,
          outer: setOuterOutlineSVG
        };
        
        setters[type](svg);
      } catch (error) {
        console.error(`Error fetching ${type} SVG:`, error);
        const setters = {
          base: setBaseSVG,
          tight: setTightOutlineSVG,
          outer: setOuterOutlineSVG
        };
        setters[type](null);
      }
    };

    fetchSVG('base');
    fetchSVG('tight');
    fetchSVG('outer');
  }, [text, fontId]);

  return { baseSVG, tightOutlineSVG, outerOutlineSVG };
};
