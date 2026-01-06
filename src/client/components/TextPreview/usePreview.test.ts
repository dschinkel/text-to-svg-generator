import { renderHook, act } from '@testing-library/react';
import { usePreview } from './usePreview';

describe('Preview Hook', () => {
  test('remembers the user\'s input text', () => {
    const { result } = renderHook(() => usePreview());

    act(() => {
      result.current.setText('Hello World');
    });

    expect(result.current.text).toBe('Hello World');
  });

  test('tracks the currently selected font for preview', () => {
    const { result } = renderHook(() => usePreview());
    const font = { id: 'octin-sports', name: 'Octin Sports', css_stack: '"octin-sports"' };

    act(() => {
      result.current.setSelectedFont(font);
    });

    expect(result.current.selectedFont).toEqual(font);
  });
});
