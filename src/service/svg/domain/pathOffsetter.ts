import ClipperLib from 'clipper-lib';

/**
 * Offsets a SVG path data string by a given amount.
 * Returns a new SVG path data string representing the offset contour.
 * If fillGaps is true, internal holes are removed.
 */
export const getOffsetPath = (d: string, offset: number, fillGaps = false): string => {
  if (offset === 0) return d;

  const scale = 1000;
  // Use a more robust way to access ClipperLib properties
  const CL = (ClipperLib as any).default || ClipperLib;
  
  const paths = d.split('Z')
    .filter(p => p.trim() !== '')
    .map(p => {
      const commands = p.trim().split(/(?=[MLZ])/);
      return commands.map(cmd => {
        const parts = cmd.trim().substring(1).split(/[\s,]+/).filter(x => x !== '');
        return { X: Math.round(parseFloat(parts[0]) * scale), Y: Math.round(parseFloat(parts[1]) * scale) };
      });
    });

  const clipper = new CL.ClipperOffset();
  const offsetPaths = new CL.Paths();
  clipper.AddPaths(paths, CL.JoinType.jtRound, CL.EndType.etClosedPolygon);
  clipper.Execute(offsetPaths, offset * scale);

  let resultD = '';
  for (let i = 0; i < offsetPaths.length; i++) {
    const path = offsetPaths[i];
    if (path.length === 0) continue;
    
    // If fillGaps is enabled, we only keep paths that are outer boundaries (clockwise).
    // In ClipperLib, Orientation returns true if clockwise.
    if (fillGaps && !CL.Clipper.Orientation(path)) {
      continue;
    }

    resultD += `M${path[0].X / scale} ${path[0].Y / scale}`;
    for (let j = 1; j < path.length; j++) {
      resultD += `L${path[j].X / scale} ${path[j].Y / scale}`;
    }
    resultD += 'Z';
  }

  return resultD;
};
