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
});
