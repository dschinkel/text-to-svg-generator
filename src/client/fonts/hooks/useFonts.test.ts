import { renderHook, waitFor, act } from '@testing-library/react';
import { useFonts } from './useFonts';

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
});
