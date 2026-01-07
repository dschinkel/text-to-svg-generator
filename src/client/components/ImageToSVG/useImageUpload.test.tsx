import { renderHook, act } from '@testing-library/react';
import { useImageUpload } from './useImageUpload';

describe('Image Upload Hook', () => {
  it('stores uploaded image', async () => {
    const { result } = renderHook(() => useImageUpload());
    
    const file = new File(['fake-image-content'], 'test.png', { type: 'image/png' });
    
    // We need to mock FileReader since it's a browser API
    const mockReader = {
      readAsDataURL: jest.fn(function(this: any) {
        this.onload({ target: { result: 'data:image/png;base64,fake-content' } });
      }),
    };
    window.FileReader = jest.fn(() => mockReader) as any;

    await act(async () => {
      result.current.handleImageSelect(file);
    });

    expect(result.current.imageSrc).toBe('data:image/png;base64,fake-content');
  });
});
