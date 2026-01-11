import React from 'react';

export interface SVGPreviewProps {
  svgString: string | null;
  label: string;
  onDownload?: () => void;
  'data-testid'?: string;
}

export const SVGPreview = ({ svgString, label, onDownload, 'data-testid': testId }: SVGPreviewProps) => {
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
      <div 
        className="flex flex-col items-center justify-center p-8 bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 min-h-[200px]"
        data-testid={testId}
      >
        <span className="text-slate-400 font-medium">{label} Preview</span>
        <span className="text-slate-300 text-sm mt-2">No preview available</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">{label}</span>
        {svgString && (
          <span className="text-[10px] text-slate-400 font-bold bg-slate-100 px-1.5 py-0.5 rounded">CLICK TO DOWNLOAD</span>
        )}
      </div>
      <div 
        ref={containerRef}
        className={`p-4 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center min-h-[200px] transition-all ${
          onDownload ? 'cursor-pointer hover:border-green-500 hover:shadow-md' : ''
        }`}
        dangerouslySetInnerHTML={{ __html: svgString }}
        onClick={onDownload}
        data-testid={testId}
        title={onDownload ? `Click to download ${label}` : undefined}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
    </div>
  );
};
