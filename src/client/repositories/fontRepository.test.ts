import { fontRepository } from './fontRepository.ts';

describe('Font Repository', () => {
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

  it('adds a font', async () => {
    const newFont = { id: 'campus-mn', name: 'Campus MN' };
    let calledUrl = '';
    let calledOptions: any = {};
    
    global.fetch = (async (url: string, options: any) => {
      calledUrl = url;
      calledOptions = options;
      return {
        ok: true,
        json: async () => newFont
      };
    }) as any;

    const repository = fontRepository();
    const result = await repository.addFont('Campus MN');

    expect(result).toEqual(newFont);
    expect(calledUrl).toBe('/api/fonts');
    expect(calledOptions.method).toBe('POST');
    expect(calledOptions.headers['Content-Type']).toBe('application/json');
    expect(calledOptions.body).toBe(JSON.stringify({ name: 'Campus MN' }));
  });

  it('removes a font', async () => {
    let calledUrl = '';
    let calledOptions: any = {};

    global.fetch = (async (url: string, options: any) => {
      calledUrl = url;
      calledOptions = options;
      return { ok: true };
    }) as any;

    const repository = fontRepository();
    await repository.removeFont('octin-sports');

    expect(calledUrl).toBe('/api/fonts/octin-sports');
    expect(calledOptions.method).toBe('DELETE');
  });
});
