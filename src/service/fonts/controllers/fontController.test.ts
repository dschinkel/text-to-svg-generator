import { fontController } from './fontController';

describe('fontController', () => {
  it('lists fonts', async () => {
    const fonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    const fakeListFontsCommand = {
      execute: jest.fn().mockResolvedValue(fonts)
    };

    const controller = fontController(fakeListFontsCommand);
    const result = await controller.getFonts();

    expect(result).toEqual(fonts);
  });
});
