import { renderHook, waitFor } from '@testing-library/react';
import { useSVG } from './useSVG';

describe('SVG Hook', () => {
  test('fetches base svg', async () => {
    const fakeSVG = '<svg><text>Hello</text></svg>';
    const fetchedUrls: string[] = [];
    
    global.fetch = ((url: string) => {
      fetchedUrls.push(url);
      return Promise.resolve({
        ok: true,
        text: async () => fakeSVG
      });
    }) as any;

    const { result } = renderHook(() => useSVG('Hello', 'octin-sports'));

    await waitFor(() => expect(result.current.baseSVG).toBe(fakeSVG));
    expect(fetchedUrls).toContain('/api/svg?text=Hello&fontId=octin-sports&type=base');
  });

  test('fetches tight outline svg', async () => {
    const fakeBaseSVG = '<svg>base</svg>';
    const fakeTightSVG = '<svg>tight</svg>';
    const fetchedUrls: string[] = [];
    
    global.fetch = ((url: string) => {
      fetchedUrls.push(url);
      if (url.includes('type=tight')) {
        return Promise.resolve({
          ok: true,
          text: async () => fakeTightSVG
        });
      }
      return Promise.resolve({
        ok: true,
        text: async () => fakeBaseSVG
      });
    }) as any;

    const { result } = renderHook(() => useSVG('Hello', 'octin-sports'));

    await waitFor(() => {
      expect(result.current.baseSVG).toBe(fakeBaseSVG);
      expect(result.current.tightOutlineSVG).toBe(fakeTightSVG);
    });

    expect(fetchedUrls).toContain('/api/svg?text=Hello&fontId=octin-sports&type=base');
    expect(fetchedUrls).toContain('/api/svg?text=Hello&fontId=octin-sports&type=tight');
  });
});
