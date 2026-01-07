/**
 * @jest-environment node
 */
import { traceImage } from './imageConverter';

describe('Image Converter', () => {
  it('converts image buffer to svg string', async () => {
    // 1x1 black PNG pixel
    const pixelBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const buffer = Buffer.from(pixelBase64, 'base64');
    
    const svg = await traceImage(buffer);
    
    expect(svg).toContain('<svg');
    expect(svg).toContain('path');
    expect(svg).toContain('</svg>');
  });
});
