import { Font } from 'opentype.js';

export const svgGenerator = (text: string, font: Font): string => {
  const fontSize = 72;
  const path = font.getPath(text, 0, 0, fontSize);
  const box = path.getBoundingBox();
  
  const width = box.x2 - box.x1;
  const height = box.y2 - box.y1;
  
  // Padding
  const padding = 10;
  const viewBox = `${box.x1 - padding} ${box.y1 - padding} ${width + 2 * padding} ${height + 2 * padding}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="100%" height="100%">
    <path d="${path.toPathData()}" fill="black" />
  </svg>`;
};
