import fetch from 'cross-fetch';

const BASE_URL = 'https://typekit.com/api/v1/json';

export const adobeTypekitClient = (token: string) => ({
  getFamily: async (familyId: string): Promise<any> => {
    const response = await fetch(`${BASE_URL}/families/${familyId}`, {
      headers: {
        'X-Typekit-Token': token
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch font family ${familyId}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.family;
  }
});
