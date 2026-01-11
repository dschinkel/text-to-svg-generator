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
  const fontMetadata = fonts.find((f: any) => f.id === familyId);

  if (!fontMetadata) {
    return null;
  }

  try {
    // Try to get font URL from kit CSS
    // Use the specific variation ID (fontId) if it exists, otherwise use the family slug
    // We need to escape the variation ID because it contains a colon which might be differently represented in CSS
    const fontUrl = await client.getFontFileUrlFromCss(kitId, fontId.includes(':') ? fontId : fontMetadata.slug);

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
