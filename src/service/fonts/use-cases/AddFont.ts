export const AddFont = async (repository: any, client: any, kitId: string, name: string, variationId?: string): Promise<any> => {
  const slug = name.toLowerCase().replace(/ /g, '-');
  const font = await repository.fetch(slug);
  
  if (font) {
    const idToAdd = variationId ? variationId.split(':')[0] : font.id;
    await client.addFamilyToKit(kitId, idToAdd);
    await client.publishKit(kitId);
  }
  
  return font;
};
