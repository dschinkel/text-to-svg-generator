import React from 'react';
import { Card } from './ui/card';

export interface LayeredPreviewProps {
  baseLayer: string | null;
  tightLayer: string | null;
  outerLayer: string | null;
  filledOuterLayer?: string | null;
  label: string;
  renderAction?: React.ReactNode;
}

export const LayeredPreview = ({ baseLayer, tightLayer, outerLayer, filledOuterLayer, label, renderAction }: LayeredPreviewProps) => {
  const isReady = baseLayer && tightLayer && outerLayer;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        {renderAction}
      </div>
      <Card 
        className="p-4 relative min-h-[300px] flex items-center justify-center overflow-hidden transition-all border-slate-200"
        data-testid="layered-preview"
      >
        {!isReady ? (
          <div className="flex flex-col items-center justify-center">
            <span className="text-slate-400 font-medium">{label} Preview</span>
            <span className="text-slate-300 text-sm mt-2">Waiting for all layers...</span>
          </div>
        ) : (
          <>
            {/* Layers are absolutely positioned to stack on each other */}
            {/* Order: Outer (bottom) -> Tight (middle) -> Base (top) */}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none p-4"
              dangerouslySetInnerHTML={{ __html: outerLayer }}
            />
            {filledOuterLayer && (
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none p-4"
                dangerouslySetInnerHTML={{ __html: filledOuterLayer }}
                data-testid="filled-outer-layer"
              />
            )}
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none p-4"
              dangerouslySetInnerHTML={{ __html: tightLayer }}
            />
            <div 
              className="absolute inset-0 flex items-center justify-center pointer-events-none p-4"
              dangerouslySetInnerHTML={{ __html: baseLayer }}
            />
          </>
        )}
      </Card>
    </div>
  );
};
