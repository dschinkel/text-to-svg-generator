export const AddFont = async (repository: any, client: any, kitId: string, name: string, variationId?: string): Promise<any> => {
  const normalizedName = name.trim();
  const slug = normalizedName.toLowerCase().replace(/ /g, '-');
  
  // Optimization: Check local repository first
  const existingFonts = await repository.getAll();
  let font = existingFonts.find((f: any) => f.slug === slug || f.name.toLowerCase() === normalizedName.toLowerCase());

  if (!font) {
    font = await repository.fetch(slug);
  }

  if (font) {
    const familyIdToAdd = variationId ? variationId.split(':')[0] : font.id;
    
    // Optimization: Check if family is already in the kit
    const kit = await client.getKit(kitId);
    const isAlreadyInKit = kit.families.some((f: any) => f.id === familyIdToAdd);

    if (!isAlreadyInKit) {
      await client.addFamilyToKit(kitId, familyIdToAdd);
      await client.publishKit(kitId);
    }
  }

  return font;
};
