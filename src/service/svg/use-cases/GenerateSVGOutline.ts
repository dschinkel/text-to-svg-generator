import { extractPathsFromSvg } from '../domain/svgPathExtractor';
import { getOffsetPath } from '../domain/pathOffsetter';

/**
 * Orchestrates the generation of a Tight Outline SVG from an uploaded multi-layer SVG.
 * 1. Extracts all paths from the SVG hierarchy.
 * 2. Flattens coordinates by applying transformations.
 * 3. Merges and offsets the combined geometry.
 * 4. Returns a solid silhouette SVG.
 */
export const GenerateSVGOutline = async (svgString: string): Promise<string> => {
  // 1. Extract and flatten all paths from the complex SVG
  const paths = extractPathsFromSvg(svgString);
  
  if (paths.length === 0) {
    throw new Error('No valid geometry found in the uploaded SVG');
  }

  // 2. Combine all paths into a single SVG path string
  const combinedPathData = paths.join(' ');

  // 3. Generate the tight outline (solid silhouette)
  // Use a standard offset (e.g., 4 units) similar to text/image tight outlines
  const TIGHT_OFFSET = 4;
  const outlinePathData = getOffsetPath(combinedPathData, TIGHT_OFFSET, true);

  // 4. Wrap the result in a new SVG container
  // We need to calculate a viewBox that fits the outline. 
  // For simplicity, we can use a large enough viewBox or try to calculate bounds.
  // TinkerCad likes SVGs to be within 300 units.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
    <path d="${outlinePathData}" fill="black" />
  </svg>`;
};
