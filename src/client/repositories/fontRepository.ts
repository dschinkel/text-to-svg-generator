export const fontRepository = () => {
  const getFonts = async (): Promise<any[]> => {
    const response = await fetch('/api/fonts');
    if (!response.ok) {
      throw new Error(`Failed to fetch fonts: ${response.statusText}`);
    }
    return await response.json();
  };

  const addFont = async (name: string, variationId?: string): Promise<any> => {
    const response = await fetch('/api/fonts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, variationId })
    });

    if (!response.ok) {
      throw new Error(`Failed to add font: ${response.statusText}`);
    }

    return await response.json();
  };

  return {
    getFonts,
    addFont
  };
};
