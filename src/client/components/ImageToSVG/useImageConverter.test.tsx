import { renderHook, act } from '@testing-library/react';
import { useImageConverter } from './useImageConverter';

describe('Image Converter Hook', () => {
  it('converts image to svg', async () => {
    const fakeSVG = '<svg><path d="M0 0H1V1H0Z"/></svg>';
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(fakeSVG),
      })
    ) as any;

    const { result } = renderHook(() => useImageConverter());

    await act(async () => {
      await result.current.convertImage('data:image/png;base64,fake-content');
    });

    expect(result.current.svgResult).toBe(fakeSVG);
    expect(global.fetch).toHaveBeenCalledWith('/api/image-to-svg', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ imageData: 'data:image/png;base64,fake-content' }),
    }));
  });
});
