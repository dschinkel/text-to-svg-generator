export const fontController = (listFontsCommand: { execute: () => Promise<any[]> }) => {
  const getFonts = async (): Promise<any[]> => {
    return await listFontsCommand.execute();
  };

  return {
    getFonts
  };
};
