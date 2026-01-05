export const listFontsCommand = (repository: { getAll: () => Promise<any[]> }) => ({
  execute: async (): Promise<any[]> => {
    return await repository.getAll();
  }
});
