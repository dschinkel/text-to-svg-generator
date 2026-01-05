import { fontRepository } from './fontRepository';

describe('fontRepository', () => {
  it('fetches fonts', async () => {
    const fakeFonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => fakeFonts
    });

    const repository = fontRepository();
    const fonts = await repository.getFonts();

    expect(fonts).toEqual(fakeFonts);
    expect(global.fetch).toHaveBeenCalledWith('/api/fonts');
  });
});
