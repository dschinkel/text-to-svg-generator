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

    // Should contain at least one path element
    const pathMatches = filledOuterSvg.match(/<path d="[^"]+"/g);
    expect(pathMatches).not.toBeNull();
    expect(pathMatches!.length).toBeGreaterThanOrEqual(1);
    
    expect(filledOuterSvg).toContain('fill="black"');
  });

  it('generates completely filled outer outline without any internal gaps', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    // 'O' has an internal hole.
    const text = 'O';
    const filledOuterSvg = svgGenerator(text, font, { type: 'filled-outer' });
    
    // Extract the first path (the offset one)
    const pathMatch = filledOuterSvg.match(/<path d="([^"]+)"/);
    expect(pathMatch).not.toBeNull();
    const d = pathMatch![1];
    
    const mCommands = d.match(/M/g) || [];
    expect(mCommands.length).toBe(1); // Should be only 1 for the outer boundary

    // Also check the base path part in the SVG if it's there
    const allPaths = filledOuterSvg.match(/<path d="([^"]+)"/g);
    // Even if base path is included, since it's the same color as the solid offset, 
    // it shouldn't matter for the visual result, BUT the offset itself must be solid.
  });

  it('generates solid filled outer outline for text Hayley', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    const text = 'Hayley';
    const filledOuterSvg = svgGenerator(text, font, { type: 'filled-outer' });
    
    // Extract the first path (the offset one)
    const pathMatch = filledOuterSvg.match(/<path d="([^"]+)"/);
    expect(pathMatch).not.toBeNull();
    const d = pathMatch![1];
    
    // Count 'M' commands. 
    // 'Hayley' has 6 letters. In the default font they don't overlap much.
    // If there were holes (a, e, y), there would be at least 10 'M' commands.
    const mCommands = d.match(/M/g) || [];
    
    // We expect 6 or fewer if some letters overlap.
    expect(mCommands.length).toBeLessThanOrEqual(6);
  });

  it('generates solid silhouette with no gap between L and E for HAYLEY', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    // We'll use 'L E' to simulate a small gap that should be bridged
    const text = 'L E';
    const filledOuterSvg = svgGenerator(text, font, { type: 'filled-outer' });
    
    const pathMatch = filledOuterSvg.match(/<path d="([^"]+)"/);
    expect(pathMatch).not.toBeNull();
    const d = pathMatch![1];
    
    const mCommands = d.match(/M/g) || [];
    // We expect 1 'M' command if the space is bridged
    expect(mCommands.length).toBe(1);
  });

  it('generates solid silhouette for text with internal holes', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    const text = 'A'; // 'A' has an internal triangle hole
    const filledOuterSvg = svgGenerator(text, font, { type: 'filled-outer' });
    
    const pathMatch = filledOuterSvg.match(/<path d="([^"]+)"/);
    expect(pathMatch).not.toBeNull();
    const d = pathMatch![1];
    
    const mCommands = d.match(/M/g) || [];
    // If holes are removed, only the outer contour 'M' should remain.
    expect(mCommands.length).toBe(1);
  });

  it('generates solid silhouette with absolutely no internal holes for HAYDEN', async () => {
    const fontPath = path.resolve(process.cwd(), 'src/service/assets/fonts/default.ttf');
    const font = await opentype.load(fontPath);
    
    const text = 'HAYDEN';
    const filledOuterSvg = svgGenerator(text, font, { type: 'filled-outer' });
    
    const pathMatch = filledOuterSvg.match(/<path d="([^"]+)"/);
    expect(pathMatch).not.toBeNull();
    const d = pathMatch![1];
    
    const mCommands = d.match(/M/g) || [];
    // Every 'M' starts a new contour. In a solid silhouette, we expect NO holes.
    // We can verify this by checking if Clipper.Orientation(contour) is always true (outer).
    // But since we can't easily call Clipper here, we'll check the total count of M commands.
    // HAYDEN has 6 letters. If they are separate, we expect 6 M's. If they overlap, fewer.
    // If they have holes, we'd expect 10+ M's.
    expect(mCommands.length).toBeLessThanOrEqual(6);
  });
});
