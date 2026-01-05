import { fontController } from './fontController';

describe('fontController', () => {
  it('lists fonts', async () => {
    const mockFonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    const mockListFontsCommand = {
      execute: jest.fn().mockResolvedValue(mockFonts)
    };

    const controller = fontController(mockListFontsCommand);
    const result = await controller.getFonts();

    expect(result).toEqual(mockFonts);
    expect(mockListFontsCommand.execute).toHaveBeenCalled();
  });
});
