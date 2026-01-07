import { ConvertImageToSVG } from './ConvertImageToSVG';

describe('Convert Image to SVG Command', () => {
  it('orchestrates image conversion with multiple layers', async () => {
    const imageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const baseSvg = '<svg><path d="M0 0H1V1H0Z"/></svg>';
    const tightSvg = '<svg><path d="M-1 -1H2V2H-1Z"/></svg>';
    
    const fakeImageConverter = {
      traceImage: async (buffer: Buffer) => baseSvg,
      generateImageTightOutline: (svg: string) => tightSvg
    };

    const result = await ConvertImageToSVG(fakeImageConverter, { imageData });
    
    expect(result.baseSVG).toBe(baseSvg);
    expect(result.tightOutlineSVG).toBe(tightSvg);
  });
});
