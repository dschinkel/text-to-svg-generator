export const applyColorToSVG = (svgString: string, color: string): string => {
  let result = svgString;
  
  // Replace fill
  if (result.includes('fill=')) {
    result = result.replace(/fill="[^"]*"/g, `fill="${color}"`).replace(/fill='[^']*'/g, `fill="${color}"`);
  } else {
    result = result.replace(/<path /g, `<path fill="${color}" `);
  }

  // Replace stroke if it exists
  if (result.includes('stroke=')) {
    result = result.replace(/stroke="[^"]*"/g, `stroke="${color}"`).replace(/stroke='[^']*'/g, `stroke="${color}"`);
  }
  
  return result;
};
