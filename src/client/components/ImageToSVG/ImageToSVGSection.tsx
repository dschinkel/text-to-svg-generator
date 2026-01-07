import React from 'react';
import { ImageUploader } from './ImageUploader';
import { ImagePreview } from './ImagePreview';
import { useImageUpload } from './useImageUpload';

export const ImageToSVGSection: React.FC = () => {
  const { imageSrc, handleImageSelect } = useImageUpload();

  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 h-full">
      <h2 className="text-xl font-semibold mb-6 text-slate-800 border-b pb-2">Image to SVG</h2>
      <ImageUploader onImageSelect={handleImageSelect} />
      <ImagePreview imageSrc={imageSrc} />
    </section>
  );
};
