import { ConvertImageToSVG } from './ConvertImageToSVG';

describe('Convert Image to SVG Command', () => {
  it('orchestrates image conversion', async () => {
    const imageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const fakeImageConverter = {
      traceImage: async (buffer: Buffer) => '<svg><path d="M0 0H1V1H0Z"/></svg>'
    };

    const result = await ConvertImageToSVG(fakeImageConverter, { imageData });
    
    expect(result).toBe('<svg><path d="M0 0H1V1H0Z"/></svg>');
  });
});
