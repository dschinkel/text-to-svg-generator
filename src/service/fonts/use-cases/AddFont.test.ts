import { AddFont } from './AddFont';

describe('Add Font', () => {
  it('adds a font', async () => {
    const font = { id: 'campus-mn', name: 'Campus MN', slug: 'campus-mn' };
    let calledSlug = '';
    const kitId = 'jzl6jgi';
    let addedToKit = false;
    let published = false;

    const fakeRepository = {
      fetch: async (slug: string) => {
        calledSlug = slug;
        return font;
      }
    };

    const fakeClient = {
      addFamilyToKit: async (kid: string, fid: string) => {
        if (kid === kitId && fid === font.id) addedToKit = true;
      },
      publishKit: async (kid: string) => {
        if (kid === kitId) published = true;
      }
    };

    const result = await AddFont(fakeRepository, fakeClient, kitId, 'Campus MN');

    expect(result).toEqual(font);
    expect(calledSlug).toBe('campus-mn');
    expect(addedToKit).toBe(true);
    expect(published).toBe(true);
  });

  it('adds cholla font to kit', async () => {
    const font = { id: 'cholla-sans', name: 'Cholla Sans', slug: 'cholla-sans' };
    const kitId = 'jzl6jgi';
    let addedToKit = false;
    let published = false;

    const fakeRepository = {
      fetch: async (slug: string) => {
        if (slug === 'cholla') return font;
        return null;
      }
    };

    const fakeClient = {
      addFamilyToKit: async (kid: string, fid: string) => {
        if (kid === kitId && fid === font.id) addedToKit = true;
      },
      publishKit: async (kid: string) => {
        if (kid === kitId) published = true;
      }
    };

    const result = await AddFont(fakeRepository, fakeClient, kitId, 'Cholla');

    expect(result).toEqual(font);
    expect(addedToKit).toBe(true);
    expect(published).toBe(true);
  });
});
