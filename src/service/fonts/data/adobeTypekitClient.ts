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
        
        const escapedSlug = familySlug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`@font-face\\s*{[^}]*font-family:"${escapedSlug}"[^}]*src:[^}]*url\\("([^"]+)"\\)\\s*format\\("opentype"\\)`, 'i');
        
        const match = regex.exec(css);
        return match ? match[1] : null;
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
