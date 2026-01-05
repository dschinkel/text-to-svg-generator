import { listFontsCommand } from './listFontsCommand';

describe('listFontsCommand', () => {
  it('lists fonts', async () => {
    const mockFonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    const mockRepository = {
      getAll: jest.fn().mockResolvedValue(mockFonts)
    };

    const command = listFontsCommand(mockRepository);
    const result = await command.execute();

    expect(result).toEqual(mockFonts);
    expect(mockRepository.getAll).toHaveBeenCalled();
  });
});
