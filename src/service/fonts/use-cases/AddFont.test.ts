import { AddFont } from './AddFont';

describe('Add a Font', () => {
  it('adds a font', async () => {
    const font = { id: 'campus-mn', name: 'Campus MN', slug: 'campus-mn' };
    let calledSlug = '';
    const fakeRepository = {
      fetch: async (slug: string) => {
        calledSlug = slug;
        return font;
      },
      getAll: async () => [],
      save: async () => {}
    };

    const result = await AddFont(fakeRepository, 'Campus MN');

    expect(result).toEqual(font);
    expect(calledSlug).toBe('campus-mn');
  });
});
