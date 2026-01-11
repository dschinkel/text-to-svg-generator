import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FontSelector } from './FontSelector';

describe('Font Selector', () => {
  test('displays variations indented under parent font', () => {
    const fonts = [
      {
        id: 'cholla-sans',
        name: 'Cholla Sans',
        css_stack: 'cholla-sans, sans-serif',
        variations: [
          { id: 'ymsq:n7', name: 'Cholla Sans Bold' }
        ]
      }
    ];

    const fakeUseFonts = () => ({
      fonts,
      filteredFonts: fonts,
      loading: false,
      error: null,
      newFontName: 'cholla',
      setNewFontName: () => {},
      isOpen: true,
      setIsOpen: () => {},
      toggleOpen: () => {},
      handleAdd: async () => {},
      handleVariationSelect: async () => {},
      containerRef: { current: null } as any
    });

    render(<FontSelector useFonts={fakeUseFonts as any} onSelect={() => {}} />);

    const variationFont = screen.getByTestId('font-variation');
    expect(variationFont).toHaveClass('pl-10');
  });

  test('displays variations even when not searching', () => {
    const fonts = [
      {
        id: 'cholla-sans',
        name: 'Cholla Sans',
        css_stack: 'cholla-sans, sans-serif',
        variations: [
          { id: 'ymsq:n7', name: 'Cholla Sans Bold' }
        ]
      }
    ];

    const fakeUseFonts = () => ({
      fonts,
      filteredFonts: fonts,
      loading: false,
      error: null,
      newFontName: '',
      setNewFontName: () => {},
      isOpen: true,
      setIsOpen: () => {},
      toggleOpen: () => {},
      handleAdd: async () => {},
      handleVariationSelect: async () => {},
      containerRef: { current: null } as any
    });

    render(<FontSelector useFonts={fakeUseFonts as any} onSelect={() => {}} />);

    const variationFont = screen.getByTestId('font-variation');
    expect(variationFont).toBeInTheDocument();
  });
});
