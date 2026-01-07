import React from 'react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-6 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
      <input 
        type="file" 
        accept="image/png, image/jpeg" 
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        data-testid="image-upload-input"
      />
      <div className="text-center">
        <p className="text-slate-600 font-medium">Click or drag image here</p>
        <p className="text-slate-400 text-sm mt-1">PNG or JPEG</p>
      </div>
    </div>
  );
};
