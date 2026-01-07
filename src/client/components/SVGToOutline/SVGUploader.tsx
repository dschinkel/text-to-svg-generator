import React from 'react';

interface SVGUploaderProps {
  onSVGSelect: (file: File) => void;
}

export const SVGUploader: React.FC<SVGUploaderProps> = ({ onSVGSelect }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      onSVGSelect(file);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      onSVGSelect(file);
    }
  };

  return (
    <div 
      className="border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={() => fileInputRef.current?.click()}
      data-testid="svg-uploader"
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".svg,image/svg+xml" 
        className="hidden" 
      />
      <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
        </svg>
      </div>
      <span className="text-sm font-medium text-slate-600 text-center">Click or drag SVG file here</span>
      <span className="text-xs text-slate-400 mt-1">Accepts .svg only</span>
    </div>
  );
};
