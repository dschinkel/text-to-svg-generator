import { RemoveFont } from './RemoveFont';

describe('Remove Font', () => {
  it('removes a font', async () => {
    let removedId = '';
    const fakeRepository = {
      remove: async (id: string) => {
        removedId = id;
      }
    };

    await RemoveFont(fakeRepository, 'octin-sports');
    expect(removedId).toBe('octin-sports');
  });
});
