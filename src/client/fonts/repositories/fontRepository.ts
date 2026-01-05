export const fontRepository = () => {
  const getFonts = async (): Promise<any[]> => {
    const response = await fetch('/api/fonts');
    if (!response.ok) {
      throw new Error(`Failed to fetch fonts: ${response.statusText}`);
    }
    return await response.json();
  };

  return {
    getFonts
  };
};
