import { Font } from 'opentype.js';

export interface SVGGeneratorOptions {
  type?: 'base' | 'tight' | 'outer';
}

export const svgGenerator = (text: string, font: Font, options: SVGGeneratorOptions = {}): string => {
  const fontSize = 72;
  
  const typeConfigs = {
    base: { padding: 30, stroke: 0, offset: 0 },
    tight: { padding: 30, stroke: 8, offset: 3 },
    outer: { padding: 30, stroke: 16, offset: 6 }
  };

  const config = typeConfigs[options.type || 'base'];
  const baseLinePath = font.getPath(text, 0, 0, fontSize);
  const box = baseLinePath.getBoundingBox();
  
  const width = box.x2 - box.x1;
  const height = box.y2 - box.y1;
  const padding = config.padding;

  const tx = padding - box.x1;
  const ty = padding - box.y1;

  const path = font.getPath(text, tx, ty, fontSize);
  const d = path.toPathData(2);
  
  let content = `<path d="${d}" fill="black" />`;
  if (config.stroke > 0) {
    content = `<path d="${d}" fill="black" stroke="black" stroke-width="${config.stroke}" stroke-linejoin="round" />`;
  }

  const totalWidth = width + 2 * padding;
  const totalHeight = height + 2 * padding;
  const viewBox = `0 0 ${totalWidth} ${totalHeight}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${totalWidth}" height="${totalHeight}">
  ${content}
</svg>`;
};
