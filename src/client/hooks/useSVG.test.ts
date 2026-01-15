import { renderHook, waitFor } from '@testing-library/react';
import { useSVG } from './useSVG.ts';

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
    expect(fetchedUrls.some(url => url.startsWith('/api/svg?text=Hello&fontId=octin-sports&type=base'))).toBe(true);
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

    expect(fetchedUrls.some(url => url.startsWith('/api/svg?text=Hello&fontId=octin-sports&type=base'))).toBe(true);
    expect(fetchedUrls.some(url => url.startsWith('/api/svg?text=Hello&fontId=octin-sports&type=tight'))).toBe(true);
  });

  test('fetches outer outline svg', async () => {
    const fakeBaseSVG = '<svg>base</svg>';
    const fakeTightSVG = '<svg>tight</svg>';
    const fakeOuterSVG = '<svg>outer</svg>';
    const fetchedUrls: string[] = [];
    
    global.fetch = ((url: string) => {
      fetchedUrls.push(url);
      if (url.includes('type=outer')) {
        return Promise.resolve({
          ok: true,
          text: async () => fakeOuterSVG
        });
      }
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
      expect(result.current.outerOutlineSVG).toBe(fakeOuterSVG);
    });

    expect(fetchedUrls.some(url => url.startsWith('/api/svg?text=Hello&fontId=octin-sports&type=base'))).toBe(true);
    expect(fetchedUrls.some(url => url.startsWith('/api/svg?text=Hello&fontId=octin-sports&type=tight'))).toBe(true);
    expect(fetchedUrls.some(url => url.startsWith('/api/svg?text=Hello&fontId=octin-sports&type=outer'))).toBe(true);
  });

  test('fetches filled outer outline image', async () => {
    const fakeBaseSVG = '<svg>base</svg>';
    const fakeTightSVG = '<svg>tight</svg>';
    const fakeOuterSVG = '<svg>outer</svg>';
    const fakeFilledOuterSVG = '<svg>filled-outer</svg>';
    const fetchedUrls: string[] = [];
    
    global.fetch = ((url: string) => {
      fetchedUrls.push(url);
      if (url.includes('type=filled-outer')) {
        return Promise.resolve({
          ok: true,
          text: async () => fakeFilledOuterSVG
        });
      }
      if (url.includes('type=outer')) {
        return Promise.resolve({
          ok: true,
          text: async () => fakeOuterSVG
        });
      }
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
      expect(result.current.filledOuterSVG).toBe(fakeFilledOuterSVG);
    });

    expect(fetchedUrls.some(url => url.startsWith('/api/svg?text=Hello&fontId=octin-sports&type=filled-outer'))).toBe(true);
  });

  test('forces re-fetch of SVGs when a new font is installed and selected', async () => {
    const fakeSVG = '<svg>new-font</svg>';
    const fetchedUrls: string[] = [];
    
    global.fetch = ((url: string) => {
      fetchedUrls.push(url);
      return Promise.resolve({
        ok: true,
        text: async () => fakeSVG
      });
    }) as any;

    const { result, rerender } = renderHook(({ fontId }) => useSVG('Hello', fontId), {
      initialProps: { fontId: 'old-font' }
    });

    await waitFor(() => expect(result.current.baseSVG).toBe(fakeSVG));
    const firstCallCount = fetchedUrls.length;

    // Simulate selecting a new font (e.g. after installation)
    rerender({ fontId: 'new-font' });

    await waitFor(() => {
      // It should have called fetch again
      expect(fetchedUrls.length).toBeGreaterThan(firstCallCount);
      // All URLs should contain the new fontId and a timestamp (_t)
      const newCalls = fetchedUrls.slice(firstCallCount);
      expect(newCalls.some(url => url.includes('fontId=new-font'))).toBe(true);
      expect(newCalls.some(url => url.includes('&_t='))).toBe(true);
    });
  });
});
