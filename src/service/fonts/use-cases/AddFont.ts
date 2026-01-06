export const AddFont = async (repository: any, client: any, kitId: string, name: string): Promise<any> => {
  const slug = name.toLowerCase().replace(/ /g, '-');
  const font = await repository.fetch(slug);
  
  if (font) {
    await client.addFamilyToKit(kitId, font.id);
    await client.publishKit(kitId);
  }
  
  return font;
};
