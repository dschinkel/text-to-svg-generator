import React from 'react';
import { SVGUploader } from './SVGUploader';
import { SVGPreviewArea } from './SVGPreviewArea';
import { SVGPreview } from '../SVGPreview';
import { useDownload } from '../../hooks/useDownload';
import { downloadSVG } from '../../domain/downloadService';

import { useSVGToOutline } from './useSVGToOutline';

export const SVGToOutlineSection: React.FC = () => {
  const { svgContent, tightOutlineSVG, onSVGSelect } = useSVGToOutline();

  const { handleDownload } = useDownload(downloadSVG);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full">
      <h2 className="text-xl font-semibold mb-6 text-slate-800 border-b pb-2">SVG to Tight Outline</h2>
      <SVGUploader onSVGSelect={onSVGSelect} />
      
      <SVGPreviewArea svgContent={svgContent} />

      {tightOutlineSVG && (
        <div className="mt-8 pt-8 border-t border-slate-200 space-y-8">
          <SVGPreview 
            svgString={tightOutlineSVG} 
            label="Tight Outline SVG" 
            onDownload={() => handleDownload(tightOutlineSVG, 'Tight Outline', 'uploaded')}
          />
        </div>
      )}
    </section>
  );
};
