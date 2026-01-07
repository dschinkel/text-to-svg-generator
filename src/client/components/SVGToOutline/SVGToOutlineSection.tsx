import React from 'react';
import { SVGUploader } from './SVGUploader';
import { SVGPreviewArea } from './SVGPreviewArea';
import { SVGPreview } from '../SVGPreview';
import { useDownload } from '../../hooks/useDownload';
import { downloadSVG } from '../../domain/downloadService';

import { useSVGToOutline } from './useSVGToOutline';

export const SVGToOutlineSection: React.FC = () => {
  const { svgContent, previewUrl, tightOutlineSVG, onSVGSelect, onDownload, isProcessing, error } = useSVGToOutline();

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-6 text-slate-800 border-b pb-2">SVG to Tight Outline</h2>
      <SVGUploader onSVGSelect={onSVGSelect} />
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <SVGPreviewArea previewUrl={previewUrl} />

      {isProcessing && (
        <div className="mt-8 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 rounded-xl animate-pulse">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-500 rounded-full animate-spin mb-4"></div>
          <p className="text-slate-500 font-medium">Generating Outline...</p>
        </div>
      )}

      {tightOutlineSVG && (
        <div className="mt-8 pt-8 border-t border-slate-200 space-y-8">
          <SVGPreview 
            svgString={tightOutlineSVG} 
            label="Tight Outline SVG" 
            onDownload={onDownload}
          />
        </div>
      )}
    </section>
  );
};
