import { useState, useCallback } from 'react';

export const useSVGUpload = () => {
  const [svgContent, setSVGContent] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const reset = useCallback(() => {
    setSVGContent(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  const handleSVGSelect = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      let content = e.target?.result as string;
      
      // Clean up the content before parsing
      content = content.trim();
      const svgStart = content.indexOf('<svg');
      const svgEnd = content.lastIndexOf('</svg>');
      if (svgStart !== -1 && svgEnd !== -1) {
        content = content.substring(svgStart, svgEnd + 6);
      }

      // Normalize SVG for preview visibility
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'image/svg+xml');
        const svg = doc.querySelector('svg');
        if (svg) {
          // Ensure mandatory namespaces
          if (!svg.getAttribute('xmlns')) {
            svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
          }

          // Force a clean viewBox and aspect ratio for the preview
          svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
          svg.removeAttribute('width');
          svg.removeAttribute('height');

          // Recursively traverse to find all points and re-calculate viewBox
          let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
          
          const updateBounds = (x: number, y: number, w: number = 0, h: number = 0) => {
            if (isNaN(x) || isNaN(y)) return;
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + w);
            maxY = Math.max(maxY, y + h);
          };

          const parseTransform = (transform: string) => {
            let tx = 0, ty = 0, sx = 1, sy = 1;
            const translates = [...transform.matchAll(/translate\(([^,)\s]+)[,\s]*([^,)\s]*)\)/g)];
            translates.forEach(m => {
              tx += parseFloat(m[1]);
              ty += parseFloat(m[2] || '0');
            });
            const scales = [...transform.matchAll(/scale\(([^,)\s]+)[,\s]*([^,)\s]*)\)/g)];
            scales.forEach(m => {
              const s1 = parseFloat(m[1]);
              const s2 = parseFloat(m[2] || m[1]);
              sx *= s1;
              sy *= s2;
            });
            const matrices = [...transform.matchAll(/matrix\(([^,)\s]+)[,\s]+([^,)\s]+)[,\s]+([^,)\s]+)[,\s]+([^,)\s]+)[,\s]+([^,)\s]+)[,\s]+([^,)\s]+)\)/g)];
            matrices.forEach(m => {
              const a = parseFloat(m[1]);
              const d = parseFloat(m[4]);
              const e = parseFloat(m[5]);
              const f = parseFloat(m[6]);
              sx *= a;
              sy *= d;
              tx += e;
              ty += f;
            });
            return { tx, ty, sx, sy };
          };

          const colors = [
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', 
            '#06b6d4', '#ec4899', '#f97316', '#84cc16', '#6366f1', '#d946ef',
          ];
          let elementCount = 0;

          const traverse = (element: Element, currentTX = 0, currentTY = 0, currentSX = 1, currentSY = 1) => {
            const transform = element.getAttribute('transform') || '';
            const { tx, ty, sx, sy } = parseTransform(transform);
            
            const nextSX = currentSX * sx;
            const nextSY = currentSY * sy;
            const nextTX = currentTX + tx * currentSX;
            const nextTY = currentTY + ty * currentSY;

            const tag = element.tagName.toLowerCase();
            const getAttr = (name: string) => parseFloat(element.getAttribute(name) || '0');

            if (['path', 'rect', 'circle', 'ellipse', 'polygon', 'polyline', 'line'].includes(tag)) {
              // 1. Ensure visibility (fix 0.001mm strokes)
              const strokeWidth = element.getAttribute('stroke-width');
              if (strokeWidth && (parseFloat(strokeWidth) < 0.1 || strokeWidth.includes('mm'))) {
                element.setAttribute('stroke-width', '1');
              }

              // 2. Colorization Logic (Non-destructive)
              let fill = element.getAttribute('fill');
              let stroke = element.getAttribute('stroke');
              const style = element.getAttribute('style') || '';
              
              // If it's black or none, consider it "uncolored"
              const isUncolored = (val: string | null) => !val || val === 'none' || val === 'black' || val === '#000000' || val === 'rgb(0,0,0)';
              
              if (isUncolored(fill) && isUncolored(stroke) && !style.includes('fill') && !style.includes('stroke')) {
                const color = colors[elementCount % colors.length];
                elementCount++;
                element.setAttribute('fill', color);
                element.setAttribute('fill-opacity', '0.6');
                element.setAttribute('stroke', '#000000');
                element.setAttribute('stroke-width', '1');
              } else if (isUncolored(fill) && stroke && stroke !== 'none') {
                // If it has a stroke but no fill, make it solid for "layer" contrast
                element.setAttribute('fill', stroke);
                element.setAttribute('fill-opacity', '0.4');
              }

              // 3. Extract bounds
              if (tag === 'path') {
                const d = element.getAttribute('d') || '';
                const coords = d.match(/([-+]?\d*\.?\d+(?:[eE][-+]?\d+)?)/g)?.map(parseFloat) || [];
                for (let i = 0; i < coords.length; i += 2) {
                  if (coords[i+1] !== undefined) {
                    updateBounds(coords[i] * nextSX + nextTX, coords[i+1] * nextSY + nextTY);
                  }
                }
              } else if (tag === 'rect') {
                const x = getAttr('x'), y = getAttr('y'), w = getAttr('width'), h = getAttr('height');
                updateBounds(x * nextSX + nextTX, y * nextSY + nextTY, w * nextSX, h * nextSY);
              } else if (tag === 'circle' || tag === 'ellipse') {
                const cx = getAttr('cx'), cy = getAttr('cy');
                const rx = tag === 'circle' ? getAttr('r') : getAttr('rx');
                const ry = tag === 'circle' ? rx : getAttr('ry');
                updateBounds((cx - rx) * nextSX + nextTX, (cy - ry) * nextSY + nextTY, rx * 2 * nextSX, ry * 2 * nextSY);
              }
            }

            Array.from(element.children).forEach(child => traverse(child, nextTX, nextTY, nextSX, nextSY));
          };

          traverse(svg);

          if (minX !== Infinity) {
            const w = maxX - minX;
            const h = maxY - minY;
            const padding = Math.max(w, h, 10) * 0.05; 
            const round = (n: number) => Math.round(n * 10000) / 10000;
            svg.setAttribute('viewBox', `${round(minX - padding)} ${round(minY - padding)} ${round(w + padding * 2)} ${round(h + padding * 2)}`);
          }

          content = new XMLSerializer().serializeToString(doc);
        }
      } catch (err) {
        console.warn('SVG Normalization failed:', err);
      }

      setSVGContent(content);
      
      // Create a Blob URL for the most compatible preview rendering
      const blob = new Blob([content], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    };
    reader.readAsText(file);
  }, []);

  return {
    svgContent,
    previewUrl,
    handleSVGSelect,
    reset,
  };
};
