import { useState } from 'react';
import { fontRepository } from '../repositories/fontRepository';
import { useFonts } from './useFonts';
import { usePreview } from '../components/TextPreview/usePreview';
import { useSVG } from './useSVG.ts';
import { useLayeredSVG } from './useLayeredSVG.ts';
import { useDownload } from './useDownload';
import { downloadSVG } from '../domain/downloadService';

const repository = fontRepository();

export const useApp = () => {
  const boundUseFonts = () => useFonts(repository);
  
  const preview = usePreview();
  const [includeFilledOuter, setIncludeFilledOuter] = useState(false);

  const { baseSVG, tightOutlineSVG, outerOutlineSVG, filledOuterSVG } = useSVG(preview.text, preview.selectedFont?.id);
  const { baseLayer, tightLayer, outerLayer, filledOuterLayer } = useLayeredSVG(baseSVG, tightOutlineSVG, outerOutlineSVG, filledOuterSVG);
  const { handleDownload, handleLayeredDownload } = useDownload(downloadSVG);

  return {
    boundUseFonts,
    preview,
    includeFilledOuter,
    setIncludeFilledOuter,
    baseSVG,
    tightOutlineSVG,
    outerOutlineSVG,
    filledOuterSVG,
    baseLayer,
    tightLayer,
    outerLayer,
    filledOuterLayer,
    handleDownload,
    handleLayeredDownload
  };
};
