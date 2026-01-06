export const GenerateBaseSVG = async (repository: any, text: string, fontId: string): Promise<string | null> => {
  const fonts = await repository.getAll();
  const font = fonts.find((f: any) => f.id === fontId);

  if (!font) {
    return null;
  }

  // Placeholder for Step 6: Domain logic
  return `<svg><text>${text}</text></svg>`;
};
