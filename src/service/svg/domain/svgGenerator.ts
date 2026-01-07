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
  const initialPath = font.getPath(text, 0, 0, fontSize);
  const box = initialPath.getBoundingBox();
  
  const width = box.x2 - box.x1;
  const height = box.y2 - box.y1;
  const padding = config.padding;

  const totalWidth = width + 2 * padding;
  const totalHeight = height + 2 * padding;

  const MAX_DIMENSION = 300;
  let scaleFactor = 1;
  if (totalWidth > MAX_DIMENSION || totalHeight > MAX_DIMENSION) {
    scaleFactor = Math.min(MAX_DIMENSION / totalWidth, MAX_DIMENSION / totalHeight);
  }

  const scaledFontSize = fontSize * scaleFactor;
  const scaledPadding = padding * scaleFactor;
  const scaledOffset = config.offset * scaleFactor;

  const baseLinePath = font.getPath(text, 0, 0, scaledFontSize);
  const scaledBox = baseLinePath.getBoundingBox();

  const tx = scaledPadding - scaledBox.x1;
  const ty = scaledPadding - scaledBox.y1;

  const path = font.getPath(text, tx, ty, scaledFontSize);
  const baseD = path.toPathData(2);
  
  const d = getOffsetPath(baseD, scaledOffset, options.type === 'outer');
  const content = `<path d="${d}" fill="black" />`;

  const finalWidth = (scaledBox.x2 - scaledBox.x1) + 2 * scaledPadding;
  const finalHeight = (scaledBox.y2 - scaledBox.y1) + 2 * scaledPadding;
  const viewBox = `0 0 ${finalWidth} ${finalHeight}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="${finalWidth}" height="${finalHeight}">
  ${content}
</svg>`;
};
