import React from 'react';
import { ReactSVG } from 'react-svg';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface SVGPreviewAreaProps {
  previewUrl: string | null;
}

export const SVGPreviewArea: React.FC<SVGPreviewAreaProps> = ({ previewUrl }) => {
  if (!previewUrl) return null;

  return (
    <Card className="mt-4 overflow-hidden border-slate-200">
      <CardHeader className="bg-slate-50 px-4 py-2 border-b border-slate-200 space-y-0">
        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Original SVG Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-4 bg-white min-h-[300px] w-full flex items-center justify-center overflow-auto">
        <ReactSVG 
          src={previewUrl} 
          className="max-w-full max-h-[400px] flex items-center justify-center"
          loading={() => <div className="text-slate-400 text-sm italic">Loading preview...</div>}
          fallback={() => <div className="text-red-400 text-sm italic">Failed to load preview</div>}
          beforeInjection={(svg) => {
            svg.setAttribute('style', 'width: 100%; height: auto; max-height: 400px;');
          }}
        />
      </CardContent>
    </Card>
  );
};
