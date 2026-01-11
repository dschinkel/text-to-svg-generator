import { renderHook, waitFor, act } from '@testing-library/react';
import { useFonts } from './useFonts.ts';

describe('Use Fonts', () => {
  it('provides available fonts', async () => {
    const fonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    const fakeRepository = {
      getFonts: async () => fonts,
      addFont: async () => ({})
    };

    const { result } = renderHook(() => useFonts(fakeRepository));

    await waitFor(() => expect(result.current.fonts).toEqual(fonts));
  });

  it('adds a font', async () => {
    const initialFonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    const newFont = { id: 'campus-mn', name: 'Campus MN' };
    
    const fakeRepository = {
      getFonts: async () => initialFonts,
      addFont: async (name: string) => newFont
    };

    const { result } = renderHook(() => useFonts(fakeRepository));
    
    await waitFor(() => expect(result.current.fonts).toEqual(initialFonts));

    await act(async () => {
      await result.current.addFont('Campus MN');
    });

    expect(result.current.fonts).toEqual([...initialFonts, newFont]);
  });

  it('filters fonts by name', async () => {
    const fonts = [
      { id: 'octin-sports', name: 'Octin Sports' },
      { id: 'campus-mn', name: 'Campus MN' }
    ];
    const fakeRepository = {
      getFonts: async () => fonts,
      addFont: async () => ({})
    };

    const { result } = renderHook(() => useFonts(fakeRepository));
    
    await waitFor(() => expect(result.current.fonts).toEqual(fonts));

    await act(async () => {
      result.current.setNewFontName('Campus');
    });

    expect(result.current.filteredFonts).toEqual([fonts[1]]);
  });

  it('closes font list when clicking outside', async () => {
    const fakeRepository = {
      getFonts: async () => [],
      addFont: async () => ({})
    };

    const { result } = renderHook(() => useFonts(fakeRepository));

    // Mock the ref since it's not attached to a real DOM in renderHook
    const div = document.createElement('div');
    Object.defineProperty(result.current.containerRef, 'current', { value: div });

    await act(async () => {
      result.current.setIsOpen(true);
    });

    expect(result.current.isOpen).toBe(true);

    // Simulate click outside (on document body, which is outside the div)
    await act(async () => {
      const event = new MouseEvent('mousedown', { bubbles: true });
      document.body.dispatchEvent(event);
    });

    expect(result.current.isOpen).toBe(false);
  });

  it('handles installing multiple variants of a font', async () => {
    const family = { 
      id: 'cholla-wide', 
      name: 'Cholla Wide',
      variations: [
        { id: 'cholla-wide-ot-ultra-bold', name: 'Cholla Wide OT Ultra Bold' },
        { id: 'cholla-wide-ot-bold', name: 'Cholla Wide OT Bold' }
      ]
    };
    const newVariation = { id: 'cholla-wide-ot-ultra-bold', name: 'Cholla Wide OT Ultra Bold' };
    
    let addedVariationId = '';
    const fakeRepository = {
      getFonts: async () => [family],
      addFont: async (name: string, variationId?: string) => {
        addedVariationId = variationId || '';
        return newVariation;
      }
    };

    const { result } = renderHook(() => useFonts(fakeRepository as any));
    
    await waitFor(() => expect(result.current.fonts).toEqual([family]));

    await act(async () => {
      await result.current.handleVariationSelect(family, 'cholla-wide-ot-ultra-bold');
    });

    expect(addedVariationId).toBe('cholla-wide-ot-ultra-bold');
    expect(result.current.fonts).toContainEqual(newVariation);
  });
});
