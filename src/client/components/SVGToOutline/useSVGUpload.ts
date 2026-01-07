import { useState, useCallback } from 'react';

export const useSVGUpload = () => {
  const [svgContent, setSVGContent] = useState<string | null>(null);

  const handleSVGSelect = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSVGContent(e.target?.result as string);
    };
    reader.readAsText(file);
  }, []);

  return {
    svgContent,
    handleSVGSelect,
  };
};
