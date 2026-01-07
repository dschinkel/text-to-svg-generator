import React from 'react';
import { ImageUploader } from './ImageUploader';
import { ImagePreview } from './ImagePreview';
import { useImageToSVG } from './useImageToSVG';
import { SVGPreview } from '../SVGPreview';
import { useDownload } from '../../hooks/useDownload';
import { downloadSVG } from '../../domain/downloadService';

export const ImageToSVGSection: React.FC = () => {
  const { 
    imageSrc, 
    svgResult, 
    tightOutlineSVG, 
    isConverting, 
    error, 
    onImageSelect 
  } = useImageToSVG();
  const { handleDownload } = useDownload(downloadSVG);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 h-full">
      <h2 className="text-xl font-semibold mb-6 text-slate-800 border-b pb-2">Image to SVG</h2>
      <ImageUploader onImageSelect={onImageSelect} />
      
      {isConverting && (
        <div className="mt-4 flex items-center justify-center p-4 bg-slate-50 rounded-lg animate-pulse">
          <span className="text-sm font-medium text-slate-500">Converting to SVG...</span>
        </div>
      )}

      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}

      <ImagePreview imageSrc={imageSrc} />

      {svgResult && (
        <div className="mt-8 pt-8 border-t border-slate-200 space-y-8">
          <SVGPreview 
            svgString={svgResult} 
            label="Base Vectorized SVG" 
            onDownload={() => handleDownload(svgResult, 'Base', 'image')}
          />
          {tightOutlineSVG && (
            <SVGPreview 
              svgString={tightOutlineSVG} 
              label="Tight Outline SVG" 
              onDownload={() => handleDownload(tightOutlineSVG, 'Tight Outline', 'image')}
            />
          )}
        </div>
      )}
    </section>
  );
};
