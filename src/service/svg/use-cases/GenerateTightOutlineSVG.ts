import { svgGenerator } from '../domain/svgGenerator';
import { loadFontForSVG } from './fontLoader';

export const GenerateTightOutlineSVG = async (
  repository: any, 
  client: any, 
  kitId: string,
  text: string, 
  fontId: string
): Promise<string | null> => {
  const font = await loadFontForSVG(repository, client, kitId, fontId);

  if (!font) {
    return null;
  }

  // Call svgGenerator with 'tight' type
  return svgGenerator(text, font, { type: 'tight' });
};
