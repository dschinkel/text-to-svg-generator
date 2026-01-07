import React from 'react';

export interface SVGLayeredPreviewProps {
  originalLayer: string | null;
  tightLayer: string | null;
  label: string;
}

export const SVGLayeredPreview = ({ originalLayer, tightLayer, label }: SVGLayeredPreviewProps) => {
  const isReady = originalLayer && tightLayer;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <div 
        className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm relative min-h-[300px] flex items-center justify-center overflow-hidden transition-all"
        data-testid="svg-layered-preview"
      >
        {!isReady ? (
          <div className="flex flex-col items-center justify-center">
            <span className="text-slate-400 font-medium">{label} Preview</span>
            <span className="text-slate-300 text-sm mt-2">Waiting for outline...</span>
          </div>
        ) : (
          <>
            {/* Layers are absolutely positioned to stack on each other */}
            {/* Order: Tight Outline (bottom) -> Original SVG (top) */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none p-4"
              dangerouslySetInnerHTML={{ __html: tightLayer }}
            />
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none p-4"
              dangerouslySetInnerHTML={{ __html: originalLayer }}
            />
          </>
        )}
      </div>
    </div>
  );
};
