import { renderHook } from '@testing-library/react';
import { useLayeredSVG } from './useLayeredSVG.ts';

describe('Layered SVG Hook', () => {
  test('provides colored layered svgs', () => {
    const baseSVG = '<svg><path d="M0 0h10v10H0z"/></svg>';
    const tightSVG = '<svg><path d="M-1 -1h12v12H-1z"/></svg>';
    const outerSVG = '<svg><path d="M-2 -2h14v14H-2z"/></svg>';
    
    const { result } = renderHook(() => useLayeredSVG(baseSVG, tightSVG, outerSVG));
    
    expect(result.current.baseLayer).toContain('fill="#000000"');
    expect(result.current.tightLayer).toContain('fill="#22c55e"');
    expect(result.current.outerLayer).toContain('fill="#3b82f6"');
  });

  test('returns null layers if inputs are null', () => {
    const { result } = renderHook(() => useLayeredSVG(null, null, null));
    
    expect(result.current.baseLayer).toBeNull();
    expect(result.current.tightLayer).toBeNull();
    expect(result.current.outerLayer).toBeNull();
  });
});
