import { renderHook, waitFor } from '@testing-library/react';
import { useFonts } from './useFonts';

describe('useFonts', () => {
  it('provides available fonts', async () => {
    const fonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    const fakeRepository = {
      getFonts: async () => fonts
    };

    const { result } = renderHook(() => useFonts(fakeRepository));

    await waitFor(() => expect(result.current.fonts).toEqual(fonts));
  });
});
