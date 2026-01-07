import { renderHook, act } from '@testing-library/react';
import { useImageConverter } from './useImageConverter';

describe('Image Converter Hook', () => {
  it('converts image to svg with multiple layers', async () => {
    const fakeResult = {
      baseSVG: '<svg><path d="M0 0H1V1H0Z"/></svg>',
      tightOutlineSVG: '<svg><path d="M-1 -1H2V2H-1Z"/></svg>'
    };
    let fetchCalledWith: any = null;
    let fetchOptions: any = null;

    global.fetch = (async (url: string, options: any) => {
      fetchCalledWith = url;
      fetchOptions = options;
      return {
        ok: true,
        json: async () => fakeResult,
      };
    }) as any;

    const { result } = renderHook(() => useImageConverter());

    await act(async () => {
      await result.current.convertImage('data:image/png;base64,fake-content');
    });

    expect(result.current.svgResult).toBe(fakeResult.baseSVG);
    expect(result.current.tightOutlineSVG).toBe(fakeResult.tightOutlineSVG);
    expect(fetchCalledWith).toBe('/api/image-to-svg');
    expect(fetchOptions.method).toBe('POST');
    expect(fetchOptions.body).toBe(JSON.stringify({ imageData: 'data:image/png;base64,fake-content' }));
  });
});
