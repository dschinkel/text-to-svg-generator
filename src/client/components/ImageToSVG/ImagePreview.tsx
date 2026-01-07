import React from 'react';

interface ImagePreviewProps {
  imageSrc: string | null;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageSrc }) => {
  if (!imageSrc) return null;

  return (
    <div className="mt-4 border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
      <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Image Preview</span>
      </div>
      <div className="p-4 flex justify-center items-center min-h-[200px]">
        <img 
          src={imageSrc} 
          alt="Uploaded preview" 
          className="max-w-full max-h-[300px] object-contain"
          data-testid="image-preview"
        />
      </div>
    </div>
  );
};
