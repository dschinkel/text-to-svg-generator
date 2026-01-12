import { GenerateFilledOuterOutlineSVG } from './GenerateFilledOuterOutlineSVG';
import * as fontLoader from './fontLoader';
import * as svgGeneratorModule from '../domain/svgGenerator';

jest.mock('./fontLoader');
jest.mock('../domain/svgGenerator');

describe('Generate Filled Outer Outline SVG', () => {
  const fakeRepo = {};
  const fakeClient = {};
  const kitId = 'kit-id';

  test('generates filled outer outline image', async () => {
    (fontLoader.loadFontForSVG as jest.Mock).mockResolvedValue({ id: 'font-id' });
    (svgGeneratorModule.svgGenerator as jest.Mock).mockResolvedValue('<svg>filled-outer</svg>');

    const result = await GenerateFilledOuterOutlineSVG(fakeRepo, fakeClient, kitId, 'Hello', 'font-id');
    
    expect(result).toBe('<svg>filled-outer</svg>');
    expect(svgGeneratorModule.svgGenerator).toHaveBeenCalledWith('Hello', { id: 'font-id' }, { type: 'filled-outer' });
  });
});
