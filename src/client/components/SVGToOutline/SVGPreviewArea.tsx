import React from 'react';

interface SVGPreviewAreaProps {
  svgContent: string | null;
}

export const SVGPreviewArea: React.FC<SVGPreviewAreaProps> = ({ svgContent }) => {
  if (!svgContent) return null;

  return (
    <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Original SVG Preview</span>
      </div>
      <div 
        className="p-4 flex justify-center items-center min-h-[200px]"
        dangerouslySetInnerHTML={{ __html: svgContent }}
        data-testid="svg-preview-area"
      />
    </div>
  );
};
