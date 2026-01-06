import { getOffsetPath } from './pathOffsetter';

describe('Path Offsetter', () => {
  test('handles paths with quadratic curves', () => {
    // A simple path with a quadratic curve: M 0 0 Q 50 50 100 0 Z
    const d = 'M0 0 Q50 50 100 0 Z';
    const offset = 5;
    const result = getOffsetPath(d, offset);
    
    // Before fix, this would likely produce an empty or broken path 
    // because it only understands M, L, Z and splits by Z.
    // The current naive parser will treat Q50 50 100 0 as a command and fail to find parts[0], parts[1].
    expect(result).not.toBe('');
    expect(result).toContain('M');
    expect(result).toContain('L');
    expect(result).toContain('Z');
  });

  test('handles paths with cubic curves', () => {
    // A simple path with a cubic curve: M 0 0 C 25 25 75 25 100 0 Z
    const d = 'M0 0 C25 25 75 25 100 0 Z';
    const offset = 5;
    const result = getOffsetPath(d, offset);
    
    expect(result).not.toBe('');
    expect(result).toContain('M');
    expect(result).toContain('L');
    expect(result).toContain('Z');
  });

  test('fills internal holes when fillGaps is true', () => {
    // A square with a hole: Outer M 0 0 L 100 0 L 100 100 L 0 100 Z, Inner M 25 25 L 25 75 L 75 75 L 75 25 Z
    // Note: Clipper orientation depends on the order of points.
    const outer = 'M0 0 L100 0 L100 100 L0 100 Z';
    const inner = 'M25 25 L25 75 L75 75 L75 25 Z'; // Counter-clockwise (hole)
    const d = outer + ' ' + inner;
    
    const offset = 2;
    const filled = getOffsetPath(d, offset, true);
    const notFilled = getOffsetPath(d, offset, false);
    
    const mFilled = (filled.match(/M/g) || []).length;
    const mNotFilled = (notFilled.match(/M/g) || []).length;
    
    expect(mFilled).toBe(1);
    expect(mNotFilled).toBe(2);
  });

  test('expands counter-clockwise paths correctly', () => {
    // A square defined CCW: M 0 0 L 0 100 L 100 100 L 100 0 Z
    const d = 'M0 0 L0 100 L100 100 L100 0 Z';
    const offset = 10;
    const result = getOffsetPath(d, offset);
    
    // If it shrinks instead of expanding, the coordinates would be inside (e.g. 10, 10)
    // If it expands, they should be outside (e.g. -10, -10)
    expect(result).toContain('-10');
  });

  test('does not filter out outer paths even if input was CCW', () => {
    // A square defined CCW: M 0 0 L 0 100 L 100 100 L 100 0 Z
    const d = 'M0 0 L0 100 L100 100 L100 0 Z';
    const offset = 10;
    const result = getOffsetPath(d, offset, true); // fillGaps = true
    
    expect(result).not.toBe('');
    expect(result).toContain('M');
  });
});
