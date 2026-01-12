import { fontController } from './fontController';

describe('Font Controller', () => {
  const fakeListFonts = async () => [];
  const fakeAddFont = async () => ({});
  const fakeRemoveFont = async () => {};
  const fakeBaseSVG = async () => 'base';
  const fakeTightSVG = async () => 'tight';
  const fakeOuterSVG = async () => 'outer';
  const fakeFilledOuterSVG = async () => 'filled-outer';

  const controller = fontController(
    fakeListFonts,
    fakeAddFont,
    fakeRemoveFont,
    fakeBaseSVG,
    fakeTightSVG,
    fakeOuterSVG,
    fakeFilledOuterSVG,
    {} as any,
    {} as any,
    'kit-id'
  );

  test('returns filled-outer image', async () => {
    // We expect this to fail initially because we haven't injected the new use case 
    // or updated the useCase mapping in the controller.
    const result = await controller.getSVG('Hello', 'font-id', 'filled-outer');
    expect(result).toBe('filled-outer');
  });
});
