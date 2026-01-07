import potrace from 'potrace';

export const traceImage = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    potrace.trace(buffer, (err, svg) => {
      if (err) {
        return reject(err);
      }
      resolve(svg);
    });
  });
};
