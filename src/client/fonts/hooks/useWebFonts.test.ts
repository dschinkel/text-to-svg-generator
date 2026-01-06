import { renderHook } from '@testing-library/react';
import { useWebFonts } from './useWebFonts';
import '@testing-library/jest-dom';

describe('Web Fonts', () => {
  it('loads adobe font styling', () => {
    const kitId = 'jzl6jgi';
    renderHook(() => useWebFonts(kitId));

    const link = document.querySelector(`link[href="https://use.typekit.net/${kitId}.css"]`);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('rel', 'stylesheet');
  });
});
