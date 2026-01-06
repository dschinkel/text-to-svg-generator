import React from 'react';

export interface SVGPreviewProps {
  svgString: string | null;
  label: string;
}

export const SVGPreview = ({ svgString, label }: SVGPreviewProps) => {
  if (!svgString) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 min-h-[200px]">
        <span className="text-slate-400 font-medium">{label} Preview</span>
        <span className="text-slate-300 text-sm mt-2">No preview available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</span>
      <div 
        className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center min-h-[200px]"
        dangerouslySetInnerHTML={{ __html: svgString }}
        data-testid={`${label.toLowerCase().replace(/ /g, '-')}-preview`}
      />
    </div>
  );
};
