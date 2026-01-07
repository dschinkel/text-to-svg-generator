import { useState, useEffect } from 'react';
import { useSVGUpload } from './useSVGUpload';

export const useSVGToOutline = () => {
  const { svgContent, previewUrl, handleSVGSelect, reset } = useSVGUpload();
  const [tightOutlineSVG, setTightOutlineSVG] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSVGSelect = (file: File) => {
    reset();
    setTightOutlineSVG(null);
    setError(null);
    handleSVGSelect(file);
  };

  useEffect(() => {
    if (svgContent && !tightOutlineSVG && !isProcessing) {
      const generateOutline = async () => {
        setIsProcessing(true);
        setError(null);
        try {
          const response = await fetch('/api/svg-to-outline', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ svgString: svgContent })
          });
          
          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to generate outline');
          }

          const { outlineSvg } = await response.json();
          setTightOutlineSVG(outlineSvg);
        } catch (err: any) {
          console.error(err);
          setError(err.message);
        } finally {
          setIsProcessing(false);
        }
      };

      generateOutline();
    }
  }, [svgContent, tightOutlineSVG, isProcessing]);

  return {
    svgContent,
    previewUrl,
    tightOutlineSVG,
    isProcessing,
    error,
    onSVGSelect,
    onDownload: () => {
      if (tightOutlineSVG) {
        const downloadService = { downloadSVG: (svg: string, label: string, name: string) => {
          const blob = new Blob([svg], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${name}-${label.replace(/\s+/g, '-')}.svg`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }};
        downloadService.downloadSVG(tightOutlineSVG, 'Tight Outline', 'uploaded');
      }
    }
  };
};
