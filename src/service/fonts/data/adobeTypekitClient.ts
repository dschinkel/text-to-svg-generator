import fetch from 'cross-fetch';

const BASE_URL = 'https://typekit.com/api/v1/json';

export const adobeTypekitClient = (token: string) => {
  const request = async (path: string, options: RequestInit = {}) => {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        'X-Typekit-Token': token
      }
    });

    if (!response.ok) {
      throw new Error(`Typekit API error at ${path}: ${response.statusText}`);
    }

    return await response.json();
  };

  return {
    getFamily: async (familyId: string): Promise<any> => {
      try {
        const data = await request(`/families/${familyId}`);
        return data.family;
      } catch (error: any) {
        if (error.message.includes('Not Found')) {
          return null;
        }
        throw error;
      }
    },

    addFamilyToKit: async (kitId: string, familyId: string): Promise<any> => {
      return await request(`/kits/${kitId}/families/${familyId}`, {
        method: 'POST'
      });
    },

    getKit: async (kitId: string): Promise<any> => {
      const data = await request(`/kits/${kitId}`);
      return data.kit;
    },

    publishKit: async (kitId: string): Promise<any> => {
      return await request(`/kits/${kitId}/publish`, {
        method: 'POST'
      });
    },

    getFontFile: async (path: string): Promise<ArrayBuffer> => {
      const response = await fetch(`${BASE_URL}${path}`, {
        headers: {
          'X-Typekit-Token': token
        }
      });

      if (!response.ok) {
        throw new Error(`Typekit Font fetch error at ${path}: ${response.statusText}`);
      }

      return await response.arrayBuffer();
    },

    getFontFileUrlFromCss: async (kitId: string, familySlug: string, variationFvd?: string): Promise<string | null> => {
      try {
        const response = await fetch(`https://use.typekit.net/${kitId}.css`);
        if (!response.ok) return null;
        const css = await response.text();
        
        // Find all font-face blocks
        const blocks = css.split('@font-face').slice(1);
        for (const block of blocks) {
          const fontFamilyMatch = /font-family\s*:\s*"?([^";]+)"?/i.exec(block);
          const srcMatch = /src\s*:\s*[^}]*url\("?([^"\\)]+)"?\)/i.exec(block);
          
          if (fontFamilyMatch && srcMatch) {
            const fontFamily = fontFamilyMatch[1].toLowerCase();
            const url = srcMatch[1];
            
            const isFamilyMatch = fontFamily.includes(familySlug.toLowerCase());
            if (!isFamilyMatch) continue;

            if (variationFvd) {
              // Match variation ID (e.g. n8) against fvd parameter in URL or font-weight in block
              const fvdMatch = /[?&]fvd=([^&]+)/.exec(url);
              const fvd = fvdMatch ? fvdMatch[1] : null;
              
              const fontWeightMatch = /font-weight\s*:\s*(\d+)/i.exec(block);
              const fontWeight = fontWeightMatch ? fontWeightMatch[1] : null;

              // Adobe FVD (Font Variation Description) is like 'n4', 'i7', etc.
              if (fvd === variationFvd) {
                return url;
              }

              // Fallback to font-weight check if fvd not in URL
              const weightDigit = variationFvd.slice(-1); // e.g. n8 -> 8
              if (fontWeight && fontWeight.startsWith(weightDigit)) {
                return url;
              }
            } else {
              return url;
            }
          }
        }
        
        return null;
      } catch (e) {
        console.error('Error fetching/parsing Typekit CSS:', e);
        return null;
      }
    },

    getFontFileBinary: async (url: string): Promise<ArrayBuffer> => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Font binary fetch error at ${url}: ${response.statusText}`);
      }
      return await response.arrayBuffer();
    }
  };
};
