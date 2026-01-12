export const fontController = (
  listFonts: (repo: any) => Promise<any[]>,
  addFont: (repo: any, client: any, kitId: string, name: string, variationId?: string) => Promise<any>,
  removeFontUseCase: (repo: any, id: string) => Promise<void>,
  BaseSVGUseCase: (text: string, fontId: string) => Promise<string | null>,
  TightOutlineSVGUseCase: (text: string, fontId: string) => Promise<string | null>,
  OuterOutlineSVGUseCase: (text: string, fontId: string) => Promise<string | null>,
  FilledOuterOutlineSVGUseCase: (text: string, fontId: string) => Promise<string | null>,
  repository: any,
  client: any,
  kitId: string
) => {
  const getFonts = async (): Promise<any[]> => {
    return await listFonts(repository);
  };

  const addFontAction = async (name: string, variationId?: string): Promise<any> => {
    return await addFont(repository, client, kitId, name, variationId);
  };

  const removeFont = async (id: string): Promise<void> => {
    return await removeFontUseCase(repository, id);
  };

  const getSVG = async (text: string, fontId: string, type: string): Promise<string | null> => {
    const useCases = {
      base: BaseSVGUseCase,
      tight: TightOutlineSVGUseCase,
      outer: OuterOutlineSVGUseCase,
      'filled-outer': FilledOuterOutlineSVGUseCase
    };

    const useCase = useCases[type] || BaseSVGUseCase;
    return await useCase(text, fontId);
  };

  return {
    getFonts,
    addFont: addFontAction,
    removeFont,
    getSVG
  };
};
