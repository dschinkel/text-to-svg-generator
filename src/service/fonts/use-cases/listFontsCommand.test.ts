import { listFontsCommand } from './listFontsCommand';

describe('listFontsCommand', () => {
  it('lists fonts', async () => {
    const fonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    const fakeRepository = {
      getAll: jest.fn().mockResolvedValue(fonts)
    };

    const command = listFontsCommand(fakeRepository);
    const result = await command.execute();

    expect(result).toEqual(fonts);
  });
});
