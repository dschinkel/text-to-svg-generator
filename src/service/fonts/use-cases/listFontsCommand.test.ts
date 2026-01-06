import { listFontsCommand } from './listFontsCommand';

describe('List Fonts', () => {
  it('lists fonts', async () => {
    const fonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    const fakeRepository = {
      getAll: async () => fonts,
      fetch: async () => ({})
    };

    const result = await listFontsCommand(fakeRepository);

    expect(result).toEqual(fonts);
  });

  it('fetches default fonts if repository is empty', async () => {
    const fonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    let state = 'empty';
    const fetched: string[] = [];
    
    const fakeRepository = {
      getAll: async () => state === 'empty' ? [] : fonts,
      fetch: async (id: string) => {
        fetched.push(id);
        state = 'populated';
      }
    };

    const result = await listFontsCommand(fakeRepository);

    expect(fetched).toContain('octin-sports');
    expect(fetched).toContain('campus-mn');
    expect(result).toEqual(fonts);
  });
});
