import { downloadSVG } from './downloadService';

describe('Download Service', () => {
  test('triggers a download', () => {
    const svgString = '<svg>test</svg>';
    const filename = 'test.svg';
    
    // Setup simple stubs for browser APIs
    const createdElements: any[] = [];
    const originalCreateElement = document.createElement.bind(document);
    
    // @ts-ignore
    document.createElement = (tagName: string) => {
      const el = originalCreateElement(tagName);
      if (tagName === 'a') {
        el.click = () => { (el as any).clicked = true; };
        createdElements.push(el);
      }
      return el;
    };

    // @ts-ignore
    window.URL.createObjectURL = () => 'blob:url';
    // @ts-ignore
    window.URL.revokeObjectURL = () => {};

    downloadSVG(svgString, filename);

    expect(createdElements.length).toBe(1);
    expect(createdElements[0].download).toBe(filename);
    expect(createdElements[0].href).toBe('blob:url');
    expect(createdElements[0].clicked).toBe(true);

    // Cleanup
    document.createElement = originalCreateElement;
  });
});
