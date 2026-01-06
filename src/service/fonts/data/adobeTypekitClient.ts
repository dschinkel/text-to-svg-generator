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
      const data = await request(`/families/${familyId}`);
      return data.family;
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
    }
  };
};
