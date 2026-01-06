export const fontController = (
  listFonts: (repo: any) => Promise<any[]>,
  addFont: (repo: any, client: any, kitId: string, name: string) => Promise<any>,
  repository: any,
  client: any,
  kitId: string
) => {
  const getFonts = async (): Promise<any[]> => {
    return await listFonts(repository);
  };

  const addFontAction = async (name: string): Promise<any> => {
    return await addFont(repository, client, kitId, name);
  };

  return {
    getFonts,
    addFont: addFontAction
  };
};
