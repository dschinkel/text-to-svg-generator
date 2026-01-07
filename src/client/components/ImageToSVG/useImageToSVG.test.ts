import { renderHook, act } from '@testing-library/react';
import { useImageToSVG } from './useImageToSVG';

describe('Image to SVG Orchestrator Hook', () => {
  it('triggers conversion automatically after image select', async () => {
    const fakeResult = {
      baseSVG: '<svg>result</svg>',
      tightOutlineSVG: '<svg>tight</svg>'
    };
    let fetchCalledWith: any = null;
    
    global.fetch = (async (url: string, options: any) => {
      fetchCalledWith = url;
      return {
        ok: true,
        json: async () => fakeResult,
      };
    }) as any;

    const { result } = renderHook(() => useImageToSVG());

    const file = new File(['fake-image'], 'test.png', { type: 'image/png' });
    
    // Fake FileReader
    const fakeReader = {
      readAsDataURL: function(this: any) {
        this.onload({ target: { result: 'data:image/png;base64,fake-content' } });
      },
    };
    window.FileReader = (function() { return fakeReader; }) as any;

    await act(async () => {
      await result.current.onImageSelect(file);
    });

    expect(result.current.imageSrc).toBe('data:image/png;base64,fake-content');
    expect(result.current.svgResult).toBe(fakeResult.baseSVG);
    expect(result.current.tightOutlineSVG).toBe(fakeResult.tightOutlineSVG);
    expect(fetchCalledWith).toBe('/api/image-to-svg');
  });

  it('resets previous state when a new image is selected', async () => {
    let fetchCount = 0;
    global.fetch = (async () => {
      fetchCount++;
      return {
        ok: true,
        json: async () => ({
          baseSVG: `<svg>${fetchCount}</svg>`,
          tightOutlineSVG: `<svg>tight-${fetchCount}</svg>`
        }),
      };
    }) as any;

    const { result } = renderHook(() => useImageToSVG());

    // 1. Initial upload
    const fakeReader1 = {
      readAsDataURL: function(this: any) {
        this.onload({ target: { result: 'data:image/png;base64,old' } });
      },
    };
    window.FileReader = (function() { return fakeReader1; }) as any;

    await act(async () => {
      await result.current.onImageSelect(new File(['old'], 'old.png', { type: 'image/png' }));
    });

    expect(result.current.svgResult).not.toBeNull();

    // 2. Second upload
    const fakeReader2 = {
      readAsDataURL: function(this: any) {
        // Do nothing initially to check reset state
      },
    };
    window.FileReader = (function() { return fakeReader2; }) as any;

    await act(async () => {
      result.current.onImageSelect(new File(['new'], 'new.png', { type: 'image/png' }));
    });

    // Verify it was reset
    expect(result.current.imageSrc).toBeNull();
    expect(result.current.svgResult).toBeNull();
  });
});
