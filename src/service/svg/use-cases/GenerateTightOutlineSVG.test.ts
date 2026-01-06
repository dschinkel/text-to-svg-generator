/**
 * @jest-environment node
 */
import { GenerateTightOutlineSVG } from './GenerateTightOutlineSVG';

describe('Generate Tight Outline SVG Use Case', () => {
  test('generates tight outline svg', async () => {
    const font = { id: 'octin-sports', slug: 'octin-sports' };
    const fakeRepository = {
      getAll: async () => [font]
    };
    const fakeClient = {
      getFontFileUrlFromCss: async () => null, // Trigger fallback to default
    };
    
    const result = await GenerateTightOutlineSVG(fakeRepository, fakeClient, 'kit-123', 'Hello', 'octin-sports');
    expect(result).toContain('<svg');
    expect(result).toContain('path');
  });

  test('returns null if font not found', async () => {
    const fakeRepository = {
      getAll: async () => []
    };
    const fakeClient = {};
    const result = await GenerateTightOutlineSVG(fakeRepository, fakeClient, 'kit-123', 'Hello', 'unknown');
    expect(result).toBeNull();
  });
});
