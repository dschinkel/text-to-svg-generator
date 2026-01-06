/**
 * @jest-environment node
 */
import { svgGenerator } from './svgGenerator';
import * as opentype from 'opentype.js';
import * as path from 'path';

describe('SVG Generator Domain', () => {
  it('generates base svg from text', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    const text = 'Hello';
    const svg = svgGenerator(text, font);

    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox=');
    expect(svg).toContain('path d=');
    expect(svg).toContain('</svg>');
  });

  it('generates tight outline svg from text', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    const text = 'Hello';
    const svg = svgGenerator(text, font, { type: 'tight' });

    expect(svg).toContain('<svg');
    expect(svg).toContain('stroke="black"');
    expect(svg).toContain('stroke-width="8"');
  });

  it('generates outer outline svg from text', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    const text = 'Hello';
    const svg = svgGenerator(text, font, { type: 'outer' });

    expect(svg).toContain('<svg');
    expect(svg).toContain('stroke="black"');
    expect(svg).toContain('stroke-width="16"');
  });
});
