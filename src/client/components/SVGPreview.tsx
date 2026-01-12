import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn } from '@/client/lib/utils';

export interface SVGPreviewProps {
  svgString: string | null;
  label: string;
  onDownload?: () => void;
  'data-testid'?: string;
  hideLabel?: boolean;
}

export const SVGPreview = ({ svgString, label, onDownload, 'data-testid': testId, hideLabel }: SVGPreviewProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      const svgElement = containerRef.current.querySelector('svg');
      if (svgElement) {
        svgElement.style.maxWidth = '100%';
        svgElement.style.height = 'auto';
        svgElement.style.display = 'block';
      }
    }
  }, [svgString]);

  if (!svgString) {
    return (
      <Card 
        className="flex flex-col items-center justify-center p-8 bg-slate-100 border-2 border-dashed border-slate-300 min-h-[200px]"
        data-testid={testId}
      >
        <span className="text-slate-400 font-medium">{label} Preview</span>
        <span className="text-slate-300 text-sm mt-2">No preview available</span>
      </Card>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      {!hideLabel && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</span>
          {svgString && (
            <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">CLICK TO DOWNLOAD</span>
          )}
        </div>
      )}
      <Card 
        ref={containerRef}
        className={cn(
          "p-4 flex items-center justify-center min-h-[200px] transition-all",
          onDownload && "cursor-pointer hover:border-primary hover:shadow-md"
        )}
        dangerouslySetInnerHTML={{ __html: svgString }}
        onClick={onDownload}
        data-testid={testId}
        title={onDownload ? `Click to download ${label}` : undefined}
      />
    </div>
  );
};
