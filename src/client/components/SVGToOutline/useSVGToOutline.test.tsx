import { renderHook, act } from '@testing-library/react';
import { useSVGToOutline } from './useSVGToOutline';

describe('SVG to Outline Orchestrator Hook', () => {
  it('resets state when new svg is selected', async () => {
    const { result } = renderHook(() => useSVGToOutline());

    // 1. Initial upload
    const svgContent1 = '<svg>1</svg>';
    const fakeReader1 = {
      readAsText: function(this: any) {
        this.onload({ target: { result: svgContent1 } });
      },
    };
    window.FileReader = (function() { return fakeReader1; }) as any;

    await act(async () => {
      await result.current.onSVGSelect(new File([svgContent1], '1.svg', { type: 'image/svg+xml' }));
    });

    expect(result.current.svgContent).toBe(svgContent1);

    // 2. Second upload (trigger reset)
    const fakeReader2 = {
      readAsText: function(this: any) {
        // Do nothing initially to check reset state
      },
    };
    window.FileReader = (function() { return fakeReader2; }) as any;

    await act(async () => {
      result.current.onSVGSelect(new File(['<svg>2</svg>'], '2.svg', { type: 'image/svg+xml' }));
    });

    // Verify it was reset
    expect(result.current.svgContent).toBeNull();
  });
});
