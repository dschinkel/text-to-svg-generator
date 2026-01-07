import { useEffect } from 'react';
import { useImageUpload } from './useImageUpload';
import { useImageConverter } from './useImageConverter';

export const useImageToSVG = () => {
  const { imageSrc, handleImageSelect, reset: resetUpload } = useImageUpload();
  const { 
    svgResult, 
    tightOutlineSVG, 
    isConverting, 
    convertImage, 
    error, 
    reset: resetConverter 
  } = useImageConverter();

  const onImageSelect = (file: File) => {
    resetUpload();
    resetConverter();
    handleImageSelect(file);
  };

  useEffect(() => {
    if (imageSrc && !svgResult && !isConverting && !error) {
      convertImage(imageSrc);
    }
  }, [imageSrc, svgResult, isConverting, convertImage, error]);

  return {
    imageSrc,
    svgResult,
    tightOutlineSVG,
    isConverting,
    error,
    onImageSelect
  };
};
