/**
 * @jest-environment node
 */
import { GenerateOuterOutlineSVG } from './GenerateOuterOutlineSVG';

describe('Generate Outer Outline SVG Use Case', () => {
  it('generates outer outline svg', async () => {
    const fakeRepository = {
      getAll: async () => [{ id: 'octin-sports', name: 'Octin Sports' }]
    };
    const fakeClient = {
      getFontFileUrlFromCss: async () => 'http://fake.url',
      getFontFileBinary: async () => new ArrayBuffer(0)
    };
    
    const result = await GenerateOuterOutlineSVG(fakeRepository, fakeClient, 'test-kit', 'Hello', 'octin-sports');

    expect(typeof result).toBe('string');
    expect(result).toContain('<svg');
  });

  it('returns nothing if font not found', async () => {
    const fakeRepository = {
      getAll: async () => []
    };
    const fakeClient = {};

    const result = await GenerateOuterOutlineSVG(fakeRepository, fakeClient, 'test-kit', 'Hello', 'unknown');

    expect(result).toBeNull();
  });
});
