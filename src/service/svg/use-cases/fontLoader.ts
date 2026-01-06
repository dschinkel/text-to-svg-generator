import * as opentype from 'opentype.js';
import * as path from 'path';

export const loadFontForSVG = async (
  repository: any, 
  client: any, 
  kitId: string, 
  fontId: string
): Promise<opentype.Font | null> => {
  const fonts = await repository.getAll();
  const fontMetadata = fonts.find((f: any) => f.id === fontId);

  if (!fontMetadata) {
    return null;
  }

  try {
    // Try to get font URL from kit CSS
    const fontUrl = await client.getFontFileUrlFromCss(kitId, fontMetadata.slug);

    if (fontUrl) {
      const buffer = await client.getFontFileBinary(fontUrl);
      return opentype.parse(buffer);
    }
    
    return await loadDefaultFont();
  } catch (error) {
    return await loadDefaultFont();
  }
};

const loadDefaultFont = async (): Promise<opentype.Font | null> => {
  try {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    return await opentype.load(fontPath);
  } catch (e) {
    return null;
  }
};
