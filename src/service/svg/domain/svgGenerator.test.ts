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

  it('generates tight outline as a filled path without strokes', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    const text = 'H';
    const baseSvg = svgGenerator(text, font, { type: 'base' });
    const tightSvg = svgGenerator(text, font, { type: 'tight' });

    expect(tightSvg).toContain('fill="black"');
    expect(tightSvg).not.toContain('stroke=');
    expect(tightSvg).not.toContain('stroke-width=');
    
    const basePathMatch = baseSvg.match(/d="([^"]+)"/);
    const tightPathMatch = tightSvg.match(/d="([^"]+)"/);
    
    expect(basePathMatch).not.toBeNull();
    expect(tightPathMatch).not.toBeNull();
    expect(tightPathMatch![1]).not.toBe(basePathMatch![1]);
  });

  it('generates outer outline as a filled path without strokes', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    const text = 'H';
    const baseSvg = svgGenerator(text, font, { type: 'base' });
    const outerSvg = svgGenerator(text, font, { type: 'outer' });

    expect(outerSvg).toContain('fill="black"');
    expect(outerSvg).not.toContain('stroke=');
    expect(outerSvg).not.toContain('stroke-width=');
    
    const basePathMatch = baseSvg.match(/d="([^"]+)"/);
    const outerPathMatch = outerSvg.match(/d="([^"]+)"/);
    
    expect(basePathMatch).not.toBeNull();
    expect(outerPathMatch).not.toBeNull();
    expect(outerPathMatch![1]).not.toBe(basePathMatch![1]);
  });

  it('fills internal gaps for tight outline', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    const text = 'O';
    const tightSvg = svgGenerator(text, font, { type: 'tight' });
    
    const pathMatch = tightSvg.match(/d="([^"]+)"/);
    expect(pathMatch).not.toBeNull();
    const d = pathMatch![1];
    const mCommands = d.match(/M/g) || [];
    
    // We expect only one closed path for 'O' if the hole is filled.
    expect(mCommands.length).toBe(1);
  });

  it('fills internal gaps for outer outline', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    const text = 'O';
    const outerSvg = svgGenerator(text, font, { type: 'outer' });
    
    // An 'O' typically has 2 paths in SVG (outer and inner hole).
    // If gaps are filled, it should only have 1 'M' command (or fewer than the base).
    const pathMatch = outerSvg.match(/d="([^"]+)"/);
    expect(pathMatch).not.toBeNull();
    const d = pathMatch![1];
    const mCommands = d.match(/M/g) || [];
    
    // We expect only one closed path for 'O' if the hole is filled.
    expect(mCommands.length).toBe(1);
  });

  it('scales text svg down if it exceeds max dimensions', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    // Use very long text to force large width
    const text = 'This is a very long text that should definitely exceed 1000 pixels in width when rendered at font size 72';
    const svg = svgGenerator(text, font);

    const widthMatch = svg.match(/width="([^"]+)"/);
    const heightMatch = svg.match(/height="([^"]+)"/);
    
    expect(widthMatch).not.toBeNull();
    expect(heightMatch).not.toBeNull();
    
    const width = parseFloat(widthMatch![1]);
    const height = parseFloat(heightMatch![1]);
    
    expect(width).toBeLessThanOrEqual(301);
    expect(height).toBeLessThanOrEqual(301);

    // Also verify viewBox is scaled
    const viewBoxMatch = svg.match(/viewBox="0 0 ([^ ]+) ([^"]+)"/);
    expect(viewBoxMatch).not.toBeNull();
    const vbWidth = parseFloat(viewBoxMatch![1]);
    expect(vbWidth).toBeLessThanOrEqual(301);
  });
});
