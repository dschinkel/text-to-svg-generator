import { renderHook, act } from '@testing-library/react';
import { useImageConverter } from './useImageConverter';

describe('Image Converter Hook', () => {
  it('converts image to svg', async () => {
    const fakeSVG = '<svg><path d="M0 0H1V1H0Z"/></svg>';
    let fetchCalledWith: any = null;
    let fetchOptions: any = null;

    global.fetch = (async (url: string, options: any) => {
      fetchCalledWith = url;
      fetchOptions = options;
      return {
        ok: true,
        text: async () => fakeSVG,
      };
    }) as any;

    const { result } = renderHook(() => useImageConverter());

    await act(async () => {
      await result.current.convertImage('data:image/png;base64,fake-content');
    });

    expect(result.current.svgResult).toBe(fakeSVG);
    expect(fetchCalledWith).toBe('/api/image-to-svg');
    expect(fetchOptions.method).toBe('POST');
    expect(fetchOptions.body).toBe(JSON.stringify({ imageData: 'data:image/png;base64,fake-content' }));
  });
});
