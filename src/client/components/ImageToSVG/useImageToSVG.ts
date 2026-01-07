import { useEffect } from 'react';
import { useImageUpload } from './useImageUpload';
import { useImageConverter } from './useImageConverter';

export const useImageToSVG = () => {
  const { imageSrc, handleImageSelect, reset: resetUpload } = useImageUpload();
  const { svgResult, isConverting, convertImage, error, reset: resetConverter } = useImageConverter();

  const onImageSelect = (file: File) => {
    resetUpload();
    resetConverter();
    handleImageSelect(file);
  };

  useEffect(() => {
    if (imageSrc && !svgResult && !isConverting) {
      convertImage(imageSrc);
    }
  }, [imageSrc, svgResult, isConverting, convertImage]);

  return {
    imageSrc,
    svgResult,
    isConverting,
    error,
    onImageSelect
  };
};
