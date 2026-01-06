import { renderHook, waitFor } from '@testing-library/react';
import { useSVG } from './useSVG';

describe('SVG Hook', () => {
  test('fetches base svg', async () => {
    const fakeSVG = '<svg><text>Hello</text></svg>';
    let fetchedUrl = '';
    
    global.fetch = ((url: string) => {
      fetchedUrl = url;
      return Promise.resolve({
        ok: true,
        text: async () => fakeSVG
      });
    }) as any;

    const { result } = renderHook(() => useSVG('Hello', 'octin-sports'));

    await waitFor(() => expect(result.current.baseSVG).toBe(fakeSVG));
    expect(fetchedUrl).toBe('/api/svg?text=Hello&fontId=octin-sports');
  });
});
