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
    global.URL.createObjectURL = () => 'blob:test-url';
    global.URL.revokeObjectURL = () => {};

    await act(async () => {
      result.current.handleSVGSelect(file);
    });

    expect(result.current.svgContent).toContain('preserveAspectRatio="xMidYMid meet"');
    expect(result.current.svgContent).toContain('<rect');
    expect(result.current.previewUrl).toBe('blob:test-url');
  });

  it('calculates viewBox correctly for nested transformations', async () => {
    const { result } = renderHook(() => useSVGUpload());
    
    // SVG with a nested translated group and a path inside it
    const rawSvg = `<svg>
      <g transform="translate(100, 100)">
        <rect x="0" y="0" width="50" height="50" />
      </g>
    </svg>`;
    const file = new File([rawSvg], 'test.svg', { type: 'image/svg+xml' });
    
    const fakeReader = {
      readAsText: function(this: any) {
        this.onload({ target: { result: rawSvg } });
      },
    };
    window.FileReader = (function() { return fakeReader; }) as any;
    
    global.URL.createObjectURL = () => 'blob:test-url';

    await act(async () => {
      result.current.handleSVGSelect(file);
    });

    // Content should be at (100, 100) with size (50, 50). 
    // viewBox should be roughly 100 100 50 50 (with 5% padding)
    // padding = max(50, 50, 10) * 0.05 = 2.5
    // viewBox="97.5 97.5 55 55"
    expect(result.current.svgContent).toContain('viewBox="97.5 97.5 55 55"');
  });

  it('handles user provided CAD SVG with off-origin coordinates', async () => {
    const { result } = renderHook(() => useSVGUpload());
    
    const rawSvg = `<?xml version="1.0" standalone="no"?>
<svg width="129mm" height="44mm" viewBox="-111.5 30.0 129.9 44.0" xmlns="http://www.w3.org/2000/svg">
<path d="M 16.48 39.5 L 16.51 39.6 L -85.14 32.7 z" />
</svg>`;
    const file = new File([rawSvg], 'hockey.svg', { type: 'image/svg+xml' });
    
    const fakeReader = {
      readAsText: function(this: any) {
        this.onload({ target: { result: rawSvg } });
      },
    };
    window.FileReader = (function() { return fakeReader; }) as any;
    
    global.URL.createObjectURL = () => 'blob:test-url';

    await act(async () => {
      result.current.handleSVGSelect(file);
    });

    // minX = -85.14, maxX = 16.51 -> width = 101.65
    // minY = 32.7, maxY = 39.6 -> height = 6.9
    // padding = max(101.65, 6.9, 10) * 0.05 = 5.0825
    // round(-85.14 - 5.0825) = -90.2225
    // round(32.7 - 5.0825) = 27.6175
    expect(result.current.svgContent).not.toContain('viewBox="-111.5');
    expect(result.current.svgContent).toContain('viewBox="-90.2225 27.6175 111.815 17.065"');
  });
  
  it('colorizes different elements with different colors', async () => {
    const { result } = renderHook(() => useSVGUpload());
    
    const rawSvg = `<svg><rect /><path d="M0 0 L10 10" /></svg>`;
    const file = new File([rawSvg], 'test.svg', { type: 'image/svg+xml' });
    
    const fakeReader = {
      readAsText: function(this: any) {
        this.onload({ target: { result: rawSvg } });
      },
    };
    window.FileReader = (function() { return fakeReader; }) as any;
    
    global.URL.createObjectURL = () => 'blob:test-url';

    await act(async () => {
      result.current.handleSVGSelect(file);
    });

    // #3b82f6 is first color, #ef4444 is second
    expect(result.current.svgContent).toContain('fill="#3b82f6"');
    expect(result.current.svgContent).toContain('fill="#ef4444"');
  });

  it('revokes preview URL on reset', async () => {
    const { result } = renderHook(() => useSVGUpload());
    
    global.URL.createObjectURL = () => 'blob:test-url';
    let revokedUrl = '';
    global.URL.revokeObjectURL = (url) => { revokedUrl = url; };

    await act(async () => {
      result.current.handleSVGSelect(new File(['<svg/>'], 'test.svg', { type: 'image/svg+xml' }));
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.previewUrl).toBeNull();
    expect(revokedUrl).toBe('blob:test-url');
  });
});
