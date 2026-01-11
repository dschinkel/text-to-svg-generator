export const SyncFontKit = async (repository: any, client: any, kitId: string): Promise<void> => {
  const fonts = await repository.getAll();
  const kit = await client.getKit(kitId);
  let changed = false;

  for (const font of fonts) {
    const isAlreadyInKit = kit.families.some((f: any) => f.id === font.id);
    if (!isAlreadyInKit) {
      await client.addFamilyToKit(kitId, font.id);
      changed = true;
    }
    
    if (font.css_stack === 'sans-serif') {
      font.css_stack = `"${font.slug}", sans-serif`;
      await repository.save(font);
    }
  }

  if (changed) {
    await client.publishKit(kitId);
  }
};
