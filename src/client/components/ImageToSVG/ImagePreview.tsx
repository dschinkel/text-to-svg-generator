import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ImagePreviewProps {
  imageSrc: string | null;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({ imageSrc }) => {
  if (!imageSrc) return null;

  return (
    <Card className="mt-4 overflow-hidden border-slate-200">
      <CardHeader className="bg-slate-50 px-4 py-2 border-b border-slate-200 space-y-0">
        <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Image Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex justify-center items-center min-h-[200px]">
        <img 
          src={imageSrc} 
          alt="Uploaded preview" 
          className="max-w-full max-h-[300px] object-contain"
          data-testid="image-preview"
        />
      </CardContent>
    </Card>
  );
};
