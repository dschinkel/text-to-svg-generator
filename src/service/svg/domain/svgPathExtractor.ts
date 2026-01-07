import { JSDOM } from 'jsdom';
import { svgPathProperties } from 'svg-path-properties';

export interface ExtractedPath {
  d: string;
  transform: string;
}

/**
 * Recursively traverses an SVG DOM tree to extract all geometry as path data strings,
 * including applying cumulative transformations.
 * Returns paths that have been flattened and normalized to a 300x300 space.
 */
export const extractPathsFromSvg = (svgString: string): string[] => {
  const dom = new JSDOM(svgString);
  const doc = dom.window.document;
  const svgElement = doc.querySelector('svg');

  if (!svgElement) return [];

  const rawPaths: string[] = [];

  const traverse = (element: Element, currentTransform: string = '') => {
    const transform = element.getAttribute('transform') || '';
    const combinedTransform = combineTransforms(currentTransform, transform);

    let d: string | null = null;
    const tag = element.tagName.toLowerCase();

    if (tag === 'path') {
      d = element.getAttribute('d');
    } else if (tag === 'rect') {
      const x = parseFloat(element.getAttribute('x') || '0');
      const y = parseFloat(element.getAttribute('y') || '0');
      const w = parseFloat(element.getAttribute('width') || '0');
      const h = parseFloat(element.getAttribute('height') || '0');
      d = `M${x},${y} h${w} v${h} h${-w} z`;
    } else if (tag === 'circle' || tag === 'ellipse') {
      const cx = parseFloat(element.getAttribute('cx') || '0');
      const cy = parseFloat(element.getAttribute('cy') || '0');
      const rx = tag === 'circle' ? parseFloat(element.getAttribute('r') || '0') : parseFloat(element.getAttribute('rx') || '0');
      const ry = tag === 'circle' ? rx : parseFloat(element.getAttribute('ry') || '0');
      const k = 0.552284749831;
      const ox = rx * k;
      const oy = ry * k;
      d = `M${cx - rx},${cy} C${cx - rx},${cy - oy} ${cx - ox},${cy - ry} ${cx},${cy - ry} ` +
          `C${cx + ox},${cy - ry} ${cx + rx},${cy - oy} ${cx + rx},${cy} ` +
          `C${cx + rx},${cy + oy} ${cx + ox},${cy + ry} ${cx},${cy + ry} ` +
          `C${cx - ox},${cy + ry} ${cx - rx},${cy + oy} ${cx - rx},${cy} Z`;
    } else if (tag === 'polygon' || tag === 'polyline') {
      const p = element.getAttribute('points');
      if (p) d = `M${p}${tag === 'polygon' ? 'z' : ''}`;
    }

    if (d) rawPaths.push(applyTransformToPath(d, combinedTransform));

    Array.from(element.children).forEach(child => traverse(child, combinedTransform));
  };

  traverse(svgElement);
  
  if (rawPaths.length === 0) return [];

  // Normalize all paths to fit 300x300
  return normalizePaths(rawPaths);
};

const combineTransforms = (parent: string, child: string): string => {
  if (!parent) return child;
  if (!child) return parent;
  return `${parent} ${child}`;
};

/**
 * Normalizes a list of paths to fit within a 300x300 box, preserving aspect ratio.
 */
const normalizePaths = (paths: string[]): string[] => {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  // 1. Find bounding box
  paths.forEach(d => {
    const coords = d.match(/([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/g)?.map(parseFloat) || [];
    for (let i = 0; i < coords.length; i += 2) {
      if (!isNaN(coords[i])) {
        minX = Math.min(minX, coords[i]);
        maxX = Math.max(maxX, coords[i]);
      }
      if (!isNaN(coords[i+1])) {
        minY = Math.min(minY, coords[i+1]);
        maxY = Math.max(maxY, coords[i+1]);
      }
    }
  });

  if (minX === Infinity) return paths;

  const width = maxX - minX;
  const height = maxY - minY;
  const targetSize = 280; // Leave some padding
  const scale = Math.min(targetSize / (width || 1), targetSize / (height || 1));
  const offsetX = (300 - width * scale) / 2 - minX * scale;
  const offsetY = (300 - height * scale) / 2 - minY * scale;

  // 2. Apply scale and offset
  return paths.map(d => {
    let isX = true;
    return d.replace(/([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/g, (match) => {
      const val = parseFloat(match);
      const res = isX ? val * scale + offsetX : val * scale + offsetY;
      isX = !isX;
      return res.toFixed(2);
    });
  });
};

/**
 * Applies an SVG transform string to a path data string.
 * Now handles both translate and scale.
 */
const applyTransformToPath = (d: string, transform: string): string => {
  if (!transform) return d;

  let tx = 0, ty = 0, sx = 1, sy = 1;

  // Extract translations
  const translates = [...transform.matchAll(/translate\(([^,)\s]+)[,\s]*([^,)\s]*)\)/g)];
  translates.forEach(m => {
    tx += parseFloat(m[1]);
    ty += parseFloat(m[2] || '0');
  });

  // Extract scales
  const scales = [...transform.matchAll(/scale\(([^,)\s]+)[,\s]*([^,)\s]*)\)/g)];
  scales.forEach(m => {
    const s1 = parseFloat(m[1]);
    const s2 = parseFloat(m[2] || m[1]); // scale(s) implies sy = sx
    sx *= s1;
    sy *= s2;
  });

  if (tx === 0 && ty === 0 && sx === 1 && sy === 1) return d;

  let isX = true;
  return d.replace(/([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/g, (match) => {
    const val = parseFloat(match);
    const result = isX ? val * sx + tx : val * sy + ty;
    isX = !isX;
    return result.toFixed(2);
  });
};
