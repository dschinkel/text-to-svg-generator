export const SyncFontKit = async (repository: any, client: any, kitId: string): Promise<void> => {
  const fonts = await repository.getAll();
  
  for (const font of fonts) {
    await client.addFamilyToKit(kitId, font.id);
    if (font.css_stack === 'sans-serif') {
      font.css_stack = `"${font.slug}", sans-serif`;
      await repository.save(font);
    }
  }
  
  await client.publishKit(kitId);
};
