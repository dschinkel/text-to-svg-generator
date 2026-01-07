import { useEffect } from 'react';
import { useImageUpload } from './useImageUpload';
import { useImageConverter } from './useImageConverter';

export const useImageToSVG = () => {
  const { imageSrc, handleImageSelect } = useImageUpload();
  const { svgResult, isConverting, convertImage, error } = useImageConverter();

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
    onImageSelect: handleImageSelect
  };
};
