import React from 'react';
import { ReactSVG } from 'react-svg';

interface SVGPreviewAreaProps {
  previewUrl: string | null;
}

export const SVGPreviewArea: React.FC<SVGPreviewAreaProps> = ({ previewUrl }) => {
  if (!previewUrl) return null;

  return (
    <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm flex flex-col">
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Original SVG Preview</span>
      </div>
      <div className="p-4 bg-white min-h-[300px] w-full flex items-center justify-center overflow-auto">
        <ReactSVG 
          src={previewUrl} 
          className="max-w-full max-h-[400px] flex items-center justify-center"
          loading={() => <div className="text-slate-400 text-sm italic">Loading preview...</div>}
          fallback={() => <div className="text-red-400 text-sm italic">Failed to load preview</div>}
          beforeInjection={(svg) => {
            svg.setAttribute('style', 'width: 100%; height: auto; max-height: 400px;');
          }}
        />
      </div>
    </div>
  );
};
