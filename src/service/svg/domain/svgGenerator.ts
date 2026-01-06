import { Font } from 'opentype.js';
import { getOffsetPath } from './pathOffsetter';

export interface SVGGeneratorOptions {
  type?: 'base' | 'tight' | 'outer';
}

export const svgGenerator = (text: string, font: Font, options: SVGGeneratorOptions = {}): string => {
  const fontSize = 72;
  
  const typeConfigs = {
    base: { padding: 30, offset: 0 },
    tight: { padding: 30, offset: 4 },
    outer: { padding: 30, offset: 8 }
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
  const baseD = path.toPathData(2);
  
  const d = getOffsetPath(baseD, config.offset, options.type === 'outer');
  const content = `<path d="${d}" fill="black" />`;

  const totalWidth = width + 2 * padding;
  const totalHeight = height + 2 * padding;
  const viewBox = `0 0 ${totalWidth} ${totalHeight}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${totalWidth}" height="${totalHeight}">
  ${content}
</svg>`;
};
