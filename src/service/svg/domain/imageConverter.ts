import potrace from 'potrace';
import { getOffsetPath } from './pathOffsetter';

export const traceImage = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    potrace.trace(buffer, (err, svg) => {
      if (err) {
        return reject(err);
      }

      const viewBoxMatch = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
      let processedSvg = svg;

      if (viewBoxMatch) {
        const width = parseInt(viewBoxMatch[1], 10);
        const height = parseInt(viewBoxMatch[2], 10);
        const MAX_DIMENSION = 1000;

        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          const scaleFactor = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height);
          const finalWidth = width * scaleFactor;
          const finalHeight = height * scaleFactor;

          // Scale the coordinates in the path data and the viewBox
          // potrace output is usually a single path with coordinates.
          // We can use a simple regex to scale all numbers in the d attribute.
          processedSvg = svg.replace(/d="([^"]+)"/g, (match, d) => {
            const scaledD = d.replace(/(-?\d+\.?\d*)/g, (num: string) => {
              const parsed = parseFloat(num);
              if (isNaN(parsed)) return num;
              return (parsed * scaleFactor).toFixed(2);
            });
            return `d="${scaledD}"`;
          });

          // Update viewBox and remove old width/height
          processedSvg = processedSvg
            .replace(/viewBox="[^"]+"/, `viewBox="0 0 ${finalWidth.toFixed(2)} ${finalHeight.toFixed(2)}"`)
            .replace(/width="[^"]+"/, `width="${finalWidth.toFixed(2)}"`)
            .replace(/height="[^"]+"/, `height="${finalHeight.toFixed(2)}"`);
        } else {
          // Just remove fixed width/height if they were there and keep it responsive
          processedSvg = svg
            .replace(/width="[^"]+"/, '')
            .replace(/height="[^"]+"/, '');
        }
      }

      resolve(processedSvg);
    });
  });
};

export const generateImageTightOutline = (baseSvg: string): string => {
  const TIGHT_OFFSET = 4;
  
  const processedSvg = baseSvg.replace(/d="([^"]+)"/g, (match, d) => {
    const tightD = getOffsetPath(d, TIGHT_OFFSET);
    return `d="${tightD}"`;
  });

  return processedSvg;
};
