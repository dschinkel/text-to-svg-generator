import { listFontsCommand } from './listFontsCommand';

describe('listFontsCommand', () => {
  it('lists fonts', async () => {
    const fonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    const fakeRepository = {
      getAll: async () => fonts,
      fetch: async () => ({})
    };

    const command = listFontsCommand(fakeRepository);
    const result = await command.execute();

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

    const command = listFontsCommand(fakeRepository);
    const result = await command.execute();

    expect(fetched).toContain('octin-sports');
    expect(fetched).toContain('campus-mn');
    expect(result).toEqual(fonts);
  });
});
