export interface FontRepository {
  getAll: () => Promise<any[]>;
  fetch: (id: string) => Promise<any>;
}

export const listFontsCommand = (repository: FontRepository) => ({
  execute: async (): Promise<any[]> => {
    let fonts = await repository.getAll();
    if (fonts.length === 0) {
      await repository.fetch('octin-sports');
      await repository.fetch('campus-mn');
      fonts = await repository.getAll();
    }
    return fonts;
  }
});
