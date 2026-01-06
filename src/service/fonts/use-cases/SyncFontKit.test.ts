import { SyncFontKit } from './SyncFontKit';

describe('Sync Font Kit', () => {
  it('ensures fonts are contained in kit', async () => {
    const fonts = [
      { id: 'tgkh', name: 'Octin Sports' },
      { id: 'rcld', name: 'Campus MN' }
    ];
    const kitId = 'jzl6jgi';
    
    const addedFamilies: string[] = [];
    let published = false;

    const fakeRepository = {
      getAll: async () => fonts
    };

    const fakeClient = {
      addFamilyToKit: async (kid: string, fid: string) => {
        if (kid === kitId) addedFamilies.push(fid);
      },
      publishKit: async (kid: string) => {
        if (kid === kitId) published = true;
      }
    };

    await SyncFontKit(fakeRepository, fakeClient, kitId);

    expect(addedFamilies).toContain('tgkh');
    expect(addedFamilies).toContain('rcld');
    expect(published).toBe(true);
  });
});
