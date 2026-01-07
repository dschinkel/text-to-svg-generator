import { renderHook, act } from '@testing-library/react';
import { useSVGUpload } from './useSVGUpload';

describe('SVG Upload Hook', () => {
  it('stores uploaded svg content and creates a preview URL', async () => {
    const { result } = renderHook(() => useSVGUpload());
    
    const rawSvg = `<svg width="100" height="50"><rect /></svg>`;
    const file = new File([rawSvg], 'test.svg', { type: 'image/svg+xml' });
    
    const fakeReader = {
      readAsText: function(this: any) {
        this.onload({ target: { result: rawSvg } });
      },
    };
    window.FileReader = (function() { return fakeReader; }) as any;
    
    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url');
    global.URL.revokeObjectURL = jest.fn();

    await act(async () => {
      result.current.handleSVGSelect(file);
    });

    expect(result.current.svgContent).toBe(rawSvg);
    expect(result.current.previewUrl).toBe('blob:test-url');
  });

  it('revokes preview URL on reset', async () => {
    const { result } = renderHook(() => useSVGUpload());
    
    global.URL.createObjectURL = jest.fn(() => 'blob:test-url');
    const revokeSpy = jest.fn();
    global.URL.revokeObjectURL = revokeSpy;

    await act(async () => {
      result.current.handleSVGSelect(new File(['<svg/>'], 'test.svg', { type: 'image/svg+xml' }));
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.previewUrl).toBeNull();
    expect(revokeSpy).toHaveBeenCalledWith('blob:test-url');
  });
});
