import { applyColorToSVG } from './svgColorService';

describe('SVG Color Service', () => {
  test('applies color to svg path', () => {
    const svgString = '<svg><path fill="black" stroke="none" d="M0 0h10v10H0z"/></svg>';
    const color = '#ff0000';
    
    const result = applyColorToSVG(svgString, color);
    
    expect(result).toContain('fill="#ff0000"');
    expect(result).not.toContain('fill="black"');
  });

  test('adds fill if missing from path', () => {
    const svgString = '<svg><path d="M0 0h10v10H0z"/></svg>';
    const color = '#00ff00';
    
    const result = applyColorToSVG(svgString, color);
    
    expect(result).toContain('fill="#00ff00"');
  });

  test('handles both fill and stroke', () => {
    const svgString = '<svg><path fill="black" stroke="black" d="..."/></svg>';
    const color = 'blue';
    
    const result = applyColorToSVG(svgString, color);
    
    expect(result).toContain('fill="blue"');
    expect(result).toContain('stroke="blue"');
  });
});
