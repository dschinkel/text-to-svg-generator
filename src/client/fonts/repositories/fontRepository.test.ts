import { fontRepository } from './fontRepository';

describe('fontRepository', () => {
  it('fetches fonts', async () => {
    const fakeFonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    let calledUrl = '';
    
    global.fetch = (async (url: string) => {
      calledUrl = url;
      return {
        ok: true,
        json: async () => fakeFonts
      };
    }) as any;

    const repository = fontRepository();
    const fonts = await repository.getFonts();

    expect(fonts).toEqual(fakeFonts);
    expect(calledUrl).toBe('/api/fonts');
  });
});
