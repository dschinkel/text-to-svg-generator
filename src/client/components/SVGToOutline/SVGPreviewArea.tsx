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
      <div className="p-4 bg-white min-h-[400px] w-full flex items-center justify-center overflow-auto">
        <img 
          src={previewUrl} 
          className="max-w-full max-h-[400px] object-contain block" 
          alt="SVG Preview"
          onError={(e) => {
            console.error('Image tag failed to load SVG:', e);
            // Fallback to dangerouslySetInnerHTML if image tag fails
            const target = e.currentTarget;
            fetch(previewUrl)
              .then(res => res.text())
              .then(text => {
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = text;
                  const svg = parent.querySelector('svg');
                  if (svg) {
                    svg.style.maxWidth = '100%';
                    svg.style.maxHeight = '400px';
                    svg.style.height = 'auto';
                    svg.style.display = 'block';
                  }
                }
              });
          }}
        />
      </div>
    </div>
  );
};
