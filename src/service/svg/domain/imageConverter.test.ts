/**
 * @jest-environment node
 */
import { traceImage, generateImageTightOutline } from './imageConverter';

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

  it('generates tight outline for image svg', async () => {
    const baseSvg = '<svg viewBox="0 0 100 100"><path d="M10 10 H90 V90 H10 Z"/></svg>';
    const tightSvg = await generateImageTightOutline(baseSvg);

    expect(tightSvg).toContain('<svg');
    expect(tightSvg).toContain('path');
    
    const basePathMatch = baseSvg.match(/d="([^"]+)"/);
    const tightPathMatch = tightSvg.match(/d="([^"]+)"/);
    
    expect(tightPathMatch![1]).not.toBe(basePathMatch![1]);
    expect(tightSvg).not.toContain('stroke=');
  });

  it('scales image svg down if it exceeds max dimensions', async () => {
    // We'll mock potrace.trace to return a large SVG
    // Actually potrace is already installed, so we can try to find a way to test it.
    // Given the current implementation of traceImage, it calls potrace.trace(buffer, callback)
    
    const potrace = await import('potrace');
    const originalTrace = potrace.default.trace;
    
    // @ts-ignore
    potrace.default.trace = (buffer: Buffer, cb: any) => {
      cb(null, '<svg viewBox="0 0 3000 2000" width="3000" height="2000"><path d="M0 0H3000V2000H0Z"/></svg>');
    };

    try {
      const svg = await traceImage(Buffer.from('fake'));
      const widthMatch = svg.match(/width="([^"]+)"/);
      const heightMatch = svg.match(/height="([^"]+)"/);
      
      expect(widthMatch).not.toBeNull();
      expect(heightMatch).not.toBeNull();
      
      const width = parseFloat(widthMatch![1]);
      const height = parseFloat(heightMatch![1]);
      
      expect(width).toBeLessThanOrEqual(1000);
      expect(height).toBeLessThanOrEqual(1000);
      // For 3000x2000, scale factor should be 1000/3000 = 1/3.
      // 3000 * 1/3 = 1000, 2000 * 1/3 = 666.66...
      expect(width).toBe(1000);
      expect(height).toBeCloseTo(666.666, 1);
    } finally {
      // @ts-ignore
      potrace.default.trace = originalTrace;
    }
  });
});
