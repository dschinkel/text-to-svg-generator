import { listFontsCommand } from './listFontsCommand';

describe('listFontsCommand', () => {
  it('lists fonts', async () => {
    const fonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    const fakeRepository = {
      getAll: jest.fn().mockResolvedValue(fonts),
      fetch: jest.fn()
    };

    const command = listFontsCommand(fakeRepository);
    const result = await command.execute();

    expect(result).toEqual(fonts);
  });

  it('fetches default fonts if repository is empty', async () => {
    const fonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    const fakeRepository = {
      getAll: jest.fn()
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce(fonts),
      fetch: jest.fn().mockResolvedValue({})
    };

    const command = listFontsCommand(fakeRepository);
    const result = await command.execute();

    expect(fakeRepository.fetch).toHaveBeenCalledWith('octin-sports');
    expect(fakeRepository.fetch).toHaveBeenCalledWith('campus-mn');
    expect(result).toEqual(fonts);
  });
});
