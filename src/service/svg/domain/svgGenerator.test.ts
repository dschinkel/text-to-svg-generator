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

  it('preserves internal holes for tight outline', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    const text = 'O';
    const tightSvg = svgGenerator(text, font, { type: 'tight' });
    
    const pathMatch = tightSvg.match(/d="([^"]+)"/);
    expect(pathMatch).not.toBeNull();
    const d = pathMatch![1];
    const mCommands = d.match(/M/g) || [];
    
    // 'O' should have outer and inner paths
    expect(mCommands.length).toBe(2);
  });

  it('preserves internal holes for outer outline', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    const text = 'O';
    const outerSvg = svgGenerator(text, font, { type: 'outer' });
    
    const pathMatch = outerSvg.match(/d="([^"]+)"/);
    expect(pathMatch).not.toBeNull();
    const d = pathMatch![1];
    const mCommands = d.match(/M/g) || [];
    
    // 'O' should have outer and inner paths
    expect(mCommands.length).toBe(2);
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

  it('generates filled outer outline with base text and outer contour', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    const text = 'H';
    const filledOuterSvg = svgGenerator(text, font, { type: 'filled-outer' });

    // Should contain at least two path elements
    const pathMatches = filledOuterSvg.match(/<path d="[^"]+"/g);
    expect(pathMatches).not.toBeNull();
    expect(pathMatches!.length).toBeGreaterThanOrEqual(2);
    
    expect(filledOuterSvg).toContain('fill="black"');
  });

  it('generates completely filled outer outline without any internal gaps', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    // 'O' and 'B' have internal holes.
    const text = 'OB';
    const filledOuterSvg = svgGenerator(text, font, { type: 'filled-outer' });
    
    // Extract the first path (the offset one)
    const pathMatch = filledOuterSvg.match(/<path d="([^"]+)"/);
    expect(pathMatch).not.toBeNull();
    const d = pathMatch![1];
    
    // It should have exactly two 'M' commands (one for 'O' and one for 'B' outer boundaries)
    // if they don't overlap. If they overlap, it should have one.
    // In any case, it should NOT have the 'M' commands for the holes.
    const mCommands = d.match(/M/g) || [];
    
    // For the default font at 72pt, O and B might not overlap.
    // Base 'O' has 2 paths. Base 'B' has 3 paths.
    // Total 5 'M' commands in base.
    // Filled outer should have at most 2.
    expect(mCommands.length).toBeLessThanOrEqual(2);
  });
});
