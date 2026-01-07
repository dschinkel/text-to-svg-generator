import { useState, useCallback } from 'react';

export const useSVGUpload = () => {
  const [svgContent, setSVGContent] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const reset = useCallback(() => {
    setSVGContent(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  const handleSVGSelect = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let content = e.target?.result as string;
      
      // Attempt to normalize complex SVGs for better previewing
      if (content.includes('transform') || content.includes('<g')) {
        try {
          const parser = new DOMParser();
          const doc = parser.parseFromString(content, 'image/svg+xml');
          const svg = doc.querySelector('svg');
          if (svg) {
            // Force a clean viewBox and aspect ratio for the preview
            svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
            // If it has no viewBox, try to create one from width/height
            if (!svg.getAttribute('viewBox')) {
              const w = svg.getAttribute('width');
              const h = svg.getAttribute('height');
              if (w && h) svg.setAttribute('viewBox', `0 0 ${parseFloat(w)} ${parseFloat(h)}`);
            }
            content = new XMLSerializer().serializeToString(doc);
          }
        } catch (err) {
          console.warn('SVG Normalization failed:', err);
        }
      }

      setSVGContent(content);
      
      // Create a Blob URL for the most compatible preview rendering
      const blob = new Blob([content], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    };
    reader.readAsText(file);
  }, []);

  return {
    svgContent,
    previewUrl,
    handleSVGSelect,
    reset,
  };
};
