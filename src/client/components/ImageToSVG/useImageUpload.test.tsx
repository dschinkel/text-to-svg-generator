import { renderHook, act } from '@testing-library/react';
import { useImageUpload } from './useImageUpload';

describe('Image Upload Hook', () => {
  it('stores uploaded image', async () => {
    const { result } = renderHook(() => useImageUpload());
    
    const file = new File(['fake-image-content'], 'test.png', { type: 'image/png' });
    
    // We need to fake FileReader since it's a browser API
    const fakeReader = {
      readAsDataURL: function(this: any) {
        this.onload({ target: { result: 'data:image/png;base64,fake-content' } });
      },
    };
    window.FileReader = (function() { return fakeReader; }) as any;

    await act(async () => {
      result.current.handleImageSelect(file);
    });

    expect(result.current.imageSrc).toBe('data:image/png;base64,fake-content');
  });
});
