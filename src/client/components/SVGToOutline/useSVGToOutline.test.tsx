import { renderHook, act } from '@testing-library/react';
import { useSVGToOutline } from './useSVGToOutline';

describe('SVG to Outline Orchestrator Hook', () => {
  beforeEach(() => {
    global.URL.createObjectURL = () => 'blob:test-url';
    global.URL.revokeObjectURL = () => {};
  });

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

    expect(result.current.svgContent).toContain('<svg');

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

  it('provides layered svg data', async () => {
    const { result } = renderHook(() => useSVGToOutline());

    // 1. Mock file upload
    const rawSvg = '<svg><path d="M0 0 L10 10" /></svg>';
    const fakeReader = {
      readAsText: function(this: any) {
        this.onload({ target: { result: rawSvg } });
      },
    };
    window.FileReader = (function() { return fakeReader; }) as any;

    // 2. Mock API response
    const outlineSvg = '<svg><path d="M-1 -1 L11 11" /></svg>';
    global.fetch = (() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ outlineSvg })
    })) as any;

    await act(async () => {
      await result.current.onSVGSelect(new File([rawSvg], 'test.svg', { type: 'image/svg+xml' }));
    });

    // 3. Verify layered data is provided
    // originalLayer should have black color applied
    // tightLayer should have green color applied
    expect(result.current.originalLayer).toContain('fill="#000000"');
    expect(result.current.tightLayer).toContain('fill="#22c55e"');
  });
});
