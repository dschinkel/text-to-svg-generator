import { renderHook } from '@testing-library/react';
import { useWebFonts } from './useWebFonts.ts';
import '@testing-library/jest-dom';

describe('Web Fonts', () => {
  it('loads adobe font styling', () => {
    const kitId = 'jzl6jgi';
    renderHook(() => useWebFonts(kitId));

    const link = document.querySelector(`link[href^="https://use.typekit.net/${kitId}.css"]`);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('rel', 'stylesheet');
  });

  it('forces css reload when version changes', () => {
    const kitId = 'jzl6jgi';
    const { rerender } = renderHook(({ version }) => useWebFonts(kitId, version), {
      initialProps: { version: 1 }
    });

    const link1 = document.querySelector(`link[href^="https://use.typekit.net/${kitId}.css?v=1"]`);
    expect(link1).toBeInTheDocument();

    rerender({ version: 2 });
    const link2 = document.querySelector(`link[href^="https://use.typekit.net/${kitId}.css?v=2"]`);
    expect(link2).toBeInTheDocument();
    expect(link1).not.toBeInTheDocument();
  });
});
