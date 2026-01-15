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

    expect(result.current.fonts).toEqual([newFont, ...initialFonts]);
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

    const { result } = renderHook(() => useFonts(fakeRepository as any));
    
    await waitFor(() => expect(result.current.fonts).toEqual([fonts[1], fonts[0]]));

    await act(async () => {
      result.current.setNewFontName('Campus');
    });

    expect(result.current.filteredFonts).toEqual([fonts[1]]);
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

  it('sorts fonts alphabetically', async () => {
    const fonts = [
      { id: 'octin-sports', name: 'Octin Sports' },
      { id: 'campus-mn', name: 'Campus MN' },
      { id: 'bungee', name: 'Bungee' }
    ];
    const fakeRepository = {
      getFonts: async () => fonts,
      addFont: async () => ({})
    };

    const { result } = renderHook(() => useFonts(fakeRepository as any));

    await waitFor(() => expect(result.current.fonts).toHaveLength(3));
    
    expect(result.current.fonts[0].name).toBe('Bungee');
    expect(result.current.fonts[1].name).toBe('Campus MN');
    expect(result.current.fonts[2].name).toBe('Octin Sports');
  });

  it('deduplicates fonts by name and id', async () => {
    const duplicateFonts = [
      { id: 'bungee', name: 'Bungee' },
      { id: 'bungee', name: 'Bungee' },
      { id: 'other-id', name: 'Bungee' },
      { id: 'campus-mn', name: 'Campus MN' }
    ];
    const fakeRepository = {
      getFonts: async () => duplicateFonts,
      addFont: async () => ({})
    };

    const { result } = renderHook(() => useFonts(fakeRepository as any));

    await waitFor(() => expect(result.current.fonts).toHaveLength(2));
    expect(result.current.fonts[0].name).toBe('Bungee');
    expect(result.current.fonts[1].name).toBe('Campus MN');
  });

  it('removes a font', async () => {
    const fonts = [
      { id: 'octin-sports', name: 'Octin Sports' },
      { id: 'campus-mn', name: 'Campus MN' }
    ];
    let removedId = '';
    const fakeRepository = {
      getFonts: async () => fonts,
      addFont: async () => ({}),
      removeFont: async (id: string) => {
        removedId = id;
      }
    };

    const { result } = renderHook(() => useFonts(fakeRepository as any));
    await waitFor(() => expect(result.current.fonts).toHaveLength(2));

    await act(async () => {
      await result.current.removeFont('octin-sports');
    });

    expect(removedId).toBe('octin-sports');
    expect(result.current.fonts).toEqual([{ id: 'campus-mn', name: 'Campus MN' }]);
  });

  it('selects newly added font immediately', async () => {
    const newFont = { id: 'bungee', name: 'Bungee' };
    const fakeRepository = {
      getFonts: async () => [],
      addFont: async () => newFont,
      removeFont: async () => {}
    };

    const { result } = renderHook(() => useFonts(fakeRepository as any));

    let addedFont: any = null;
    await act(async () => {
      addedFont = await result.current.addFont('Bungee');
    });

    expect(addedFont).toEqual(newFont);
    expect(result.current.fonts).toContainEqual(newFont);
  });

  it('waits for font to be ready before selecting it', async () => {
    const newFont = { id: 'bungee', name: 'Bungee' };
    const fakeRepository = {
      getFonts: async () => [],
      addFont: async () => newFont,
      removeFont: async () => {}
    };

    // Mock document.fonts.load to simulate font loading
    const loadMock = jest.fn().mockResolvedValue([]);
    Object.defineProperty(document, 'fonts', {
      value: { load: loadMock },
      configurable: true
    });

    const { result } = renderHook(() => useFonts(fakeRepository as any));

    // We need to trigger the real implementation of handleAdd which calls addFont
    await act(async () => {
      await result.current.addFont('Bungee');
    });

    expect(loadMock).toHaveBeenCalledWith('1em "Bungee"');
  });
});
