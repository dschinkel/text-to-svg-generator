import ClipperLib from 'clipper-lib';

/**
 * Offsets a SVG path data string by a given amount.
 * Returns a new SVG path data string representing the offset contour.
 * If fillGaps is true, internal holes are removed.
 */
export const getOffsetPath = (d: string, offset: number, fillGaps = false): string => {
  if (offset === 0) return d;

  const scale = 1000;
  const CL = (ClipperLib as any).default || ClipperLib;
  
  const paths = parseAndFlattenPath(d, scale);

  const clipper = new CL.ClipperOffset();
  
  // Simplify input paths to handle self-intersections
  const simplifiedPaths = CL.Clipper.SimplifyPolygons(paths, CL.PolyFillType.pftNonZero);
  
  let pathsToOffset = simplifiedPaths;
  if (fillGaps) {
    // To fill gaps, we only offset the outermost boundaries of the shapes.
    // Clipper.Orientation returns true for outer contours in a Y-down coordinate system.
    pathsToOffset = simplifiedPaths.filter(p => CL.Clipper.Orientation(p));
  }
  
  clipper.AddPaths(pathsToOffset, CL.JoinType.jtRound, CL.EndType.etClosedPolygon);
  
  let resultD = '';
  
  if (fillGaps) {
    const offsetPaths = new CL.Paths();
    clipper.Execute(offsetPaths, offset * scale);
    
    // Perform a Union to merge overlapping letters
    const solution = new CL.Paths();
    const c = new CL.Clipper();
    c.AddPaths(offsetPaths, CL.PolyType.ptSubject, true);
    
    // Use PolyTree to explicitly separate outer from inner
    const tree = new CL.PolyTree();
    c.Execute(CL.ClipType.ctUnion, tree, CL.PolyFillType.pftNonZero, CL.PolyFillType.pftNonZero);
    
    // Recursively collect ONLY the level 0 contours (outer boundaries of clusters)
    // Level 1 nodes in PolyTree are holes and are discarded.
    const outerNodes = tree.Childs();
    for (let i = 0; i < outerNodes.length; i++) {
      const node = outerNodes[i];
      resultD += pathToSvg(node.Contour(), scale);
    }
  } else {
    const offsetPaths = new CL.Paths();
    clipper.Execute(offsetPaths, offset * scale);
    for (let i = 0; i < offsetPaths.length; i++) {
      resultD += pathToSvg(offsetPaths[i], scale);
    }
  }

  return resultD;
};

const pathToSvg = (path: any[], scale: number): string => {
  if (path.length === 0) return '';
  let d = `M${path[0].X / scale} ${path[0].Y / scale}`;
  for (let j = 1; j < path.length; j++) {
    d += `L${path[j].X / scale} ${path[j].Y / scale}`;
  }
  d += 'Z';
  return d;
};

const parseAndFlattenPath = (d: string, scale: number): any[][] => {
  const paths: any[][] = [];
  let currentPath: any[] = [];
  
  // Regex to match SVG commands and their arguments
  const commandRegex = /([a-df-z])([^a-df-z]*)/gi;
  let match;
  
  let lastX = 0;
  let lastY = 0;
  let startX = 0;
  let startY = 0;

  while ((match = commandRegex.exec(d)) !== null) {
    const command = match[1];
    const args = match[2].trim().split(/[\s,]+/).filter(x => x !== '').map(parseFloat);
    const isRelative = command === command.toLowerCase();
    const type = command.toUpperCase();

    switch (type) {
      case 'M':
        for (let i = 0; i < args.length; i += 2) {
          let x = args[i];
          let y = args[i + 1];
          if (isRelative) {
            x += lastX;
            y += lastY;
          }
          if (i === 0) {
            if (currentPath.length > 0) paths.push(currentPath);
            currentPath = [{ X: Math.round(x * scale), Y: Math.round(y * scale) }];
            startX = x;
            startY = y;
          } else {
            currentPath.push({ X: Math.round(x * scale), Y: Math.round(y * scale) });
          }
          lastX = x;
          lastY = y;
        }
        break;
      case 'L':
        for (let i = 0; i < args.length; i += 2) {
          let x = args[i];
          let y = args[i + 1];
          if (isRelative) {
            x += lastX;
            y += lastY;
          }
          currentPath.push({ X: Math.round(x * scale), Y: Math.round(y * scale) });
          lastX = x;
          lastY = y;
        }
        break;
      case 'H':
        for (let i = 0; i < args.length; i++) {
          let x = args[i];
          if (isRelative) x += lastX;
          currentPath.push({ X: Math.round(x * scale), Y: Math.round(lastY * scale) });
          lastX = x;
        }
        break;
      case 'V':
        for (let i = 0; i < args.length; i++) {
          let y = args[i];
          if (isRelative) y += lastY;
          currentPath.push({ X: Math.round(lastX * scale), Y: Math.round(y * scale) });
          lastY = y;
        }
        break;
      case 'Q':
        for (let i = 0; i < args.length; i += 4) {
          let cx = args[i];
          let cy = args[i + 1];
          let x = args[i + 2];
          let y = args[i + 3];
          if (isRelative) {
            cx += lastX;
            cy += lastY;
            x += lastX;
            y += lastY;
          }
          flattenQuadraticBezier(lastX, lastY, cx, cy, x, y, scale, currentPath);
          lastX = x;
          lastY = y;
        }
        break;
      case 'C':
        for (let i = 0; i < args.length; i += 6) {
          let c1x = args[i];
          let c1y = args[i + 1];
          let c2x = args[i + 2];
          let c2y = args[i + 3];
          let x = args[i + 4];
          let y = args[i + 5];
          if (isRelative) {
            c1x += lastX;
            c1y += lastY;
            c2x += lastX;
            c2y += lastY;
            x += lastX;
            y += lastY;
          }
          flattenCubicBezier(lastX, lastY, c1x, c1y, c2x, c2y, x, y, scale, currentPath);
          lastX = x;
          lastY = y;
        }
        break;
      case 'Z':
        if (currentPath.length > 0) {
          paths.push(currentPath);
          currentPath = [];
        }
        lastX = startX;
        lastY = startY;
        break;
    }
  }
  if (currentPath.length > 0) paths.push(currentPath);
  return paths;
};

const flattenQuadraticBezier = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, scale: number, path: any[]) => {
  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2;
    const y = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
    path.push({ X: Math.round(x * scale), Y: Math.round(y * scale) });
  }
};

const flattenCubicBezier = (x1: number, y1: number, c1x: number, c1y: number, c2x: number, c2y: number, x2: number, y2: number, scale: number, path: any[]) => {
  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const x = (1 - t) * (1 - t) * (1 - t) * x1 + 3 * (1 - t) * (1 - t) * t * c1x + 3 * (1 - t) * t * t * c2x + t * t * t * x2;
    const y = (1 - t) * (1 - t) * (1 - t) * y1 + 3 * (1 - t) * (1 - t) * t * c1y + 3 * (1 - t) * t * t * c2y + t * t * t * y2;
    path.push({ X: Math.round(x * scale), Y: Math.round(y * scale) });
  }
};
