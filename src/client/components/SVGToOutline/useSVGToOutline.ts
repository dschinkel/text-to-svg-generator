import { useSVGUpload } from './useSVGUpload';

export const useSVGToOutline = () => {
  const { svgContent, handleSVGSelect, reset } = useSVGUpload();

  const onSVGSelect = (file: File) => {
    reset();
    handleSVGSelect(file);
  };

  return {
    svgContent,
    onSVGSelect,
    tightOutlineSVG: null // Placeholder for next tasks
  };
};
