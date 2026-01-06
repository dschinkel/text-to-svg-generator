import { fontController } from './fontController';

describe('Font Controller', () => {
  it('lists fonts', async () => {
    const fonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    const fakeListFonts = async () => fonts;
    const fakeAddFont = async () => ({});
    const fakeRepository = {};
    const fakeClient = {};
    const kitId = 'test-kit';

    const controller = fontController(fakeListFonts, fakeAddFont, fakeRepository, fakeClient, kitId);
    const result = await controller.getFonts();

    expect(result).toEqual(fonts);
  });

  it('adds a font', async () => {
    const newFont = { id: 'campus-mn', name: 'Campus MN' };
    const fakeAddFont = async (repo: any, client: any, kitId: string, name: string) => {
      if (name === 'Campus MN') return newFont;
      return null;
    };
    const fakeListFonts = async () => [];
    const fakeRepository = {};
    const fakeClient = {};
    const kitId = 'test-kit';

    const controller = fontController(fakeListFonts, fakeAddFont, fakeRepository, fakeClient, kitId);
    const result = await controller.addFont('Campus MN');

    expect(result).toEqual(newFont);
  });
});
