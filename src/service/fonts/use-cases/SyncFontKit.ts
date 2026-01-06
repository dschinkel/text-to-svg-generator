export const SyncFontKit = async (repository: any, client: any, kitId: string): Promise<void> => {
  const fonts = await repository.getAll();
  
  for (const font of fonts) {
    await client.addFamilyToKit(kitId, font.id);
  }
  
  await client.publishKit(kitId);
};
