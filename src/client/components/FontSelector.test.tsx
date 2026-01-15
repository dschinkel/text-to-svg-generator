import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

  test('renders remove font button', () => {
    const fonts = [{ id: 'bungee', name: 'Bungee' }];
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
      removeFont: async () => {},
      containerRef: { current: null } as any
    });

    render(<FontSelector useFonts={fakeUseFonts as any} onSelect={() => {}} />);

    const removeButton = screen.getByTestId('remove-font');
    expect(removeButton).toBeInTheDocument();
  });

  test('calls onSelect when a new font is added via handleAdd', async () => {
    const newFont = { id: 'bungee', name: 'Bungee' };
    let selectedFont: any = null;
    const onSelect = (f: any) => { selectedFont = f; };

    const fakeUseFonts = () => ({
      fonts: [],
      filteredFonts: [],
      loading: false,
      error: null,
      newFontName: 'Bungee',
      setNewFontName: () => {},
      isOpen: true,
      setIsOpen: () => {},
      toggleOpen: () => {},
      handleAdd: async () => {
        onSelect(newFont);
      },
      handleVariationSelect: async () => {},
      removeFont: async () => {},
      containerRef: { current: null } as any
    });

    render(<FontSelector useFonts={fakeUseFonts as any} onSelect={onSelect} />);

    const addOption = screen.getByTestId('add-font-option');
    fireEvent.click(addOption);

    expect(selectedFont).toEqual(newFont);
  });
});
