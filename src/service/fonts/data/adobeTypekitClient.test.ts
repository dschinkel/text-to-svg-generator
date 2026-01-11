/**
 * @jest-environment node
 */
import { adobeTypekitClient } from './adobeTypekitClient';
import fetch from 'cross-fetch';

jest.mock('cross-fetch', () => {
  const actualFetch = jest.requireActual('cross-fetch');
  return {
    __esModule: true,
    default: jest.fn((url, options) => {
      // Only mock kit CSS requests for unit testing parsing
      if (typeof url === 'string' && url.includes('use.typekit.net') && url.endsWith('.css')) {
        return Promise.resolve({
          ok: true,
          text: async () => `
            @font-face {
              font-family:"bungee";
              src:url("https://use.typekit.net/af/fb901b/00000000000000007735b230/31/l?subset_id=2&fvd=n4&v=3") format("woff2");
              font-weight:400;
            }
            @font-face {
              font-family:"bungee";
              src:url("https://use.typekit.net/af/dad83f/00000000000000007735b232/31/l?subset_id=2&fvd=n5&v=3") format("woff2");
              font-weight:500;
            }
          `
        });
      }
      return actualFetch(url, options);
    })
  };
});

describe('Adobe Typekit Client', () => {
  const token = process.env.ADOBE_TYPEKIT_TOKEN || 'fake-token';
  const kitId = 'jzl6jgi';
  const client = adobeTypekitClient(token);

  describe('CSS Parsing', () => {
    it('identifies the correct URL for a variation using fvd in URL', async () => {
      const url = await client.getFontFileUrlFromCss(kitId, 'bungee', 'n5');
      expect(url).toBe('https://use.typekit.net/af/dad83f/00000000000000007735b232/31/l?subset_id=2&fvd=n5&v=3');
    });

    it('falls back to family slug match if no variation suffix', async () => {
      const url = await client.getFontFileUrlFromCss(kitId, 'bungee');
      expect(url).toBe('https://use.typekit.net/af/fb901b/00000000000000007735b230/31/l?subset_id=2&fvd=n4&v=3');
    });
  });

  describe('Integration', () => {
    if (!process.env.ADOBE_TYPEKIT_TOKEN) {
      it.skip('skipping integration tests because ADOBE_TYPEKIT_TOKEN is not set', () => {});
      return;
    }

    it('manages kit families', async () => {
      const familyId = 'tgkh'; // Octin Sports
      const result = await client.addFamilyToKit(kitId, familyId);
      expect(result).toBeDefined();
    });

    it('publishes kits', async () => {
      const result = await client.publishKit(kitId);
      expect(result).toBeDefined();
    });
  });
});
