import * as opentype from 'opentype.js';
import * as path from 'path';

export const loadFontForSVG = async (
  repository: any, 
  client: any, 
  kitId: string, 
  fontId: string
): Promise<opentype.Font | null> => {
  const familyId = fontId.split(':')[0];
  const fonts = await repository.getAll();
  
  // Try to find the font metadata by familyId (e.g. ymsq or zgyk)
  // or by searching within variations of all families
  let fontMetadata = fonts.find((f: any) => f.id === familyId);
  
  if (!fontMetadata) {
    fontMetadata = fonts.find((f: any) => 
      f.variations && f.variations.some((v: any) => v.id.startsWith(familyId + ':'))
    );
  }

  if (!fontMetadata) {
    return null;
  }

  try {
    // Try to get font URL from kit CSS
    // Use the family slug for family matching and the variation FVD (e.g. n5) if it exists
    const variationFvd = fontId.includes(':') ? fontId.split(':')[1] : undefined;
    const fontUrl = await client.getFontFileUrlFromCss(kitId, fontMetadata.slug, variationFvd);

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
