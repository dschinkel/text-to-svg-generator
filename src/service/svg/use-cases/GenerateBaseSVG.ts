import * as opentype from 'opentype.js';
import * as path from 'path';
import { svgGenerator } from '../domain/svgGenerator';

export const GenerateBaseSVG = async (
  repository: any, 
  client: any, 
  kitId: string,
  text: string, 
  fontId: string
): Promise<string | null> => {
  const fonts = await repository.getAll();
  const fontMetadata = fonts.find((f: any) => f.id === fontId);

  if (!fontMetadata) {
    return null;
  }

  try {
    let font: opentype.Font;

    // Try to get font URL from kit CSS
    const fontUrl = await client.getFontFileUrlFromCss(kitId, fontMetadata.slug);

    if (fontUrl) {
      const buffer = await client.getFontFileBinary(fontUrl);
      font = opentype.parse(buffer);
    } else {
      // Fallback to default
      const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
      font = await opentype.load(fontPath);
    }

    return svgGenerator(text, font);
  } catch (error) {
    // Fallback to default font on error
    try {
      const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
      const font = await opentype.load(fontPath);
      return svgGenerator(text, font);
    } catch (fallbackError) {
      return null;
    }
  }
};
