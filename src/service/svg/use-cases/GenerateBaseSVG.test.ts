import { GenerateBaseSVG } from './GenerateBaseSVG';

describe('Generate Base SVG Use Case', () => {
  it('generates base svg', async () => {
    const fakeRepository = {
      getAll: async () => [{ id: 'octin-sports', name: 'Octin Sports' }]
    };
    
    const result = await GenerateBaseSVG(fakeRepository, 'Hello', 'octin-sports');

    // We expect a string that looks like an SVG, even if it's currently a dummy
    expect(typeof result).toBe('string');
    expect(result).toContain('<svg');
  });

  it('returns null if font not found', async () => {
    const fakeRepository = {
      getAll: async () => []
    };

    const result = await GenerateBaseSVG(fakeRepository, 'Hello', 'unknown');

    expect(result).toBeNull();
  });
});
