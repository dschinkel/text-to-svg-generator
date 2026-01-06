import { renderHook, act } from '@testing-library/react';
import { useDownload } from './useDownload';
import { downloadSVG } from '../domain/downloadService';

// Fake for downloadSVG
let lastDownload: { svg: string; filename: string } | null = null;
const fakeDownloadSVG = (svg: string, filename: string) => {
  lastDownload = { svg, filename };
};

describe('useDownload', () => {
  beforeEach(() => {
    lastDownload = null;
  });

  test('downloads a single SVG', () => {
    const { result } = renderHook(() => useDownload(fakeDownloadSVG));
    
    act(() => {
      result.current.handleDownload('<svg>test</svg>', 'Test Label', 'hello');
    });

    expect(lastDownload).not.toBeNull();
    expect(lastDownload?.filename).toBe('hello-test-label.svg');
    expect(lastDownload?.svg).toBe('<svg>test</svg>');
  });
});
