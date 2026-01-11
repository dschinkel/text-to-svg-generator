import { useMemo } from 'react';
import { applyColorToSVG } from '../domain/svgColorService';

export const useLayeredSVG = (
  baseSVG: string | null,
  tightSVG: string | null,
  outerSVG: string | null
) => {
  return useMemo(() => {
    return {
      baseLayer: baseSVG ? applyColorToSVG(baseSVG, '#000000') : null,
      tightLayer: tightSVG ? applyColorToSVG(tightSVG, '#22c55e') : null,
      outerLayer: outerSVG ? applyColorToSVG(outerSVG, '#3b82f6') : null,
    };
  }, [baseSVG, tightSVG, outerSVG]);
};
