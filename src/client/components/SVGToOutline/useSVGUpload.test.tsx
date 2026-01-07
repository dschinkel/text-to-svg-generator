import { renderHook, act } from '@testing-library/react';
import { useSVGUpload } from './useSVGUpload';

describe('SVG Upload Hook', () => {
  it('stores uploaded svg content', async () => {
    const { result } = renderHook(() => useSVGUpload());
    
    const svgContent = '<svg><rect /></svg>';
    const file = new File([svgContent], 'test.svg', { type: 'image/svg+xml' });
    
    const fakeReader = {
      readAsText: function(this: any) {
        this.onload({ target: { result: svgContent } });
      },
    };
    window.FileReader = (function() { return fakeReader; }) as any;

    await act(async () => {
      result.current.handleSVGSelect(file);
    });

    expect(result.current.svgContent).toBe(svgContent);
  });
});
