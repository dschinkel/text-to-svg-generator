import { loadFontForSVG } from './fontLoader';
import * as opentype from 'opentype.js';

describe('Font Loader', () => {
  it('finds font metadata by variation prefix if family ID does not match', async () => {
    const fonts = [
      {
        id: 'cholla-wide',
        slug: 'cholla-wide',
        variations: [
          { id: 'zgyk:n8', name: 'Cholla Wide Ultra Bold' }
        ]
      }
    ];
    const repository = {
      getAll: async () => fonts
    };
    const client = {
      getFontFileUrlFromCss: async () => 'http://example.com/font.woff2',
      getFontFileBinary: async () => new ArrayBuffer(0)
    };
    
    // Mock opentype.parse to avoid needing real font data
    const mockFont = {} as any;
    jest.spyOn(opentype, 'parse').mockReturnValue(mockFont);

    const result = await loadFontForSVG(repository, client, 'kit-id', 'zgyk:n8');
    
    expect(result).toBe(mockFont);
    
    jest.restoreAllMocks();
  });
});
