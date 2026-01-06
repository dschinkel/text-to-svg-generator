import { fontController } from './fontController';

describe('Font Controller', () => {
  it('lists fonts', async () => {
    const fonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    const fakeListFonts = async () => fonts;
    const fakeAddFont = async () => ({});
    const fakeBaseSVGUseCase = async () => null;
    const fakeRepository = {};
    const fakeClient = {};
    const kitId = 'test-kit';

    const controller = fontController(fakeListFonts, fakeAddFont, fakeBaseSVGUseCase, fakeRepository, fakeClient, kitId);
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
    const fakeBaseSVGUseCase = async () => null;
    const fakeRepository = {};
    const fakeClient = {};
    const kitId = 'test-kit';

    const controller = fontController(fakeListFonts, fakeAddFont, fakeBaseSVGUseCase, fakeRepository, fakeClient, kitId);
    const result = await controller.addFont('Campus MN');

    expect(result).toEqual(newFont);
  });

  it('generates base svg', async () => {
    const fakeSVG = '<svg>test</svg>';
    const fakeBaseSVGUseCase = async (text: string, fontId: string) => {
      if (text === 'Hello' && fontId === 'octin-sports') return fakeSVG;
      return null;
    };
    const fakeListFonts = async () => [];
    const fakeAddFont = async () => ({});
    const fakeRepository = {};
    const fakeClient = {};
    const kitId = 'test-kit';

    const controller = fontController(fakeListFonts, fakeAddFont, fakeBaseSVGUseCase, fakeRepository, fakeClient, kitId);
    const result = await controller.getBaseSVG('Hello', 'octin-sports');

    expect(result).toBe(fakeSVG);
  });
});
