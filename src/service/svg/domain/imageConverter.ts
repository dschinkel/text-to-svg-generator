import potrace from 'potrace';

export const traceImage = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    potrace.trace(buffer, (err, svg) => {
      if (err) {
        return reject(err);
      }
      // Remove width and height to let it scale within container, but keep viewBox
      const cleanedSvg = svg
        .replace(/width="[^"]+"/, '')
        .replace(/height="[^"]+"/, '');
      resolve(cleanedSvg);
    });
  });
};
