/**
 * @jest-environment node
 */
import { GenerateBaseSVG } from './GenerateBaseSVG';

describe('Generate Base SVG Use Case', () => {
  it('generates base svg', async () => {
    const fakeRepository = {
      getAll: async () => [{ id: 'octin-sports', name: 'Octin Sports' }]
    };
    const fakeClient = {
      getFontFileUrlFromCss: async () => 'http://fake.url',
      getFontFileBinary: async () => new ArrayBuffer(0)
    };
    
    const result = await GenerateBaseSVG(fakeRepository, fakeClient, 'test-kit', 'Hello', 'octin-sports');

    // We expect a string that looks like an SVG, even if it's currently a dummy
    expect(typeof result).toBe('string');
    expect(result).toContain('<svg');
  });

  it('returns nothing if font not found', async () => {
    const fakeRepository = {
      getAll: async () => []
    };
    const fakeClient = {};

    const result = await GenerateBaseSVG(fakeRepository, fakeClient, 'test-kit', 'Hello', 'unknown');

    expect(result).toBeNull();
  });
});
