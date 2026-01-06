import { Font } from 'opentype.js';

export interface SVGGeneratorOptions {
  type?: 'base' | 'tight' | 'outer';
}

export const svgGenerator = (text: string, font: Font, options: SVGGeneratorOptions = {}): string => {
  const fontSize = 72;
  const path = font.getPath(text, 0, 0, fontSize);
  const pathData = path.toPathData();
  const box = path.getBoundingBox();
  
  const width = box.x2 - box.x1;
  const height = box.y2 - box.y1;
  
  // Padding
  const padding = options.type === 'tight' ? 20 : 10;
  const viewBox = `${box.x1 - padding} ${box.y1 - padding} ${width + 2 * padding} ${height + 2 * padding}`;

  let content = `<path d="${pathData}" fill="black" />`;

  if (options.type === 'tight') {
    content = `
    <path d="${pathData}" fill="none" stroke="black" stroke-width="8" stroke-linejoin="round" />
    <path d="${pathData}" fill="black" />`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%">
    ${content}
  </svg>`;
};
