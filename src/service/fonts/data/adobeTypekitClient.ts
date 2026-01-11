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

    getFontFileUrlFromCss: async (kitId: string, familySlug: string): Promise<string | null> => {
      try {
        const response = await fetch(`https://use.typekit.net/${kitId}.css`);
        if (!response.ok) return null;
        const css = await response.text();
        
        // Adobe CSS uses font-family names, not slugs or IDs.
        // For variations, it might be something like "cholla-sans:n7"
        // Also remove format check as it might vary
        // IMPORTANT: We need to handle BOTH the slug and the variation ID (which contains a colon)
        const parts = familySlug.split(':');
        const familyName = parts[0];
        const variation = parts[1];
        
        const escapedFamily = familyName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        // Find all font-face blocks
        const blocks = css.split('@font-face').slice(1);
        for (const block of blocks) {
          const fontFamilyMatch = /font-family\s*:\s*"?([^";]+)"?/i.exec(block);
          const srcMatch = /src\s*:\s*[^}]*url\("?([^"\\)]+)"?\)/i.exec(block);
          
          if (fontFamilyMatch && srcMatch) {
            const fontFamily = fontFamilyMatch[1].toLowerCase();
            const url = srcMatch[1];
            
            if (variation) {
              // If variation is provided (e.g. zgyk:n8), try to match it
              // Sometimes variation is preceded by a hyphen or colon
              // We also need to consider that the variation in font-family might be just the name part or the weight part
              const weight = variation.slice(-2); // e.g. n8 -> 8
              if (fontFamily.includes(familyName.toLowerCase()) && 
                  (fontFamily.includes(variation.toLowerCase()) || 
                   fontFamily.includes(variation.toLowerCase().replace(':', '')) ||
                   fontFamily.includes(weight))) {
                return url;
              }
            } else {
              if (fontFamily.includes(familyName.toLowerCase())) {
                return url;
              }
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
