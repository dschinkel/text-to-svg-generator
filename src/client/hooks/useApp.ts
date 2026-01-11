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
  const { baseSVG, tightOutlineSVG, outerOutlineSVG } = useSVG(preview.text, preview.selectedFont?.id);
  const { baseLayer, tightLayer, outerLayer } = useLayeredSVG(baseSVG, tightOutlineSVG, outerOutlineSVG);
  const { handleDownload, handleLayeredDownload } = useDownload(downloadSVG);

  return {
    boundUseFonts,
    preview,
    baseSVG,
    tightOutlineSVG,
    outerOutlineSVG,
    baseLayer,
    tightLayer,
    outerLayer,
    handleDownload,
    handleLayeredDownload
  };
};
