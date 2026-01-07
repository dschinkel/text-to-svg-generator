import { useState, useCallback } from 'react';

export const useImageUpload = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const reset = useCallback(() => {
    setImageSrc(null);
  }, []);

  const handleImageSelect = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  return {
    imageSrc,
    handleImageSelect,
    reset
  };
};
