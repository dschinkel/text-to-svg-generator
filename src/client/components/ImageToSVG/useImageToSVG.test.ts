import { renderHook, act } from '@testing-library/react';
import { useImageToSVG } from './useImageToSVG';

describe('Image to SVG Orchestrator Hook', () => {
  it('triggers conversion automatically after image select', async () => {
    const fakeSVG = '<svg>result</svg>';
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        text: () => Promise.resolve(fakeSVG),
      })
    ) as any;

    const { result } = renderHook(() => useImageToSVG());

    const file = new File(['fake-image'], 'test.png', { type: 'image/png' });
    
    // Mock FileReader
    const mockReader = {
      readAsDataURL: jest.fn(function(this: any) {
        this.onload({ target: { result: 'data:image/png;base64,fake-content' } });
      }),
    };
    window.FileReader = jest.fn(() => mockReader) as any;

    await act(async () => {
      await result.current.onImageSelect(file);
    });

    expect(result.current.imageSrc).toBe('data:image/png;base64,fake-content');
    expect(result.current.svgResult).toBe(fakeSVG);
    expect(global.fetch).toHaveBeenCalledWith('/api/image-to-svg', expect.any(Object));
  });
});
