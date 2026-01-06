/**
 * @jest-environment node
 */
import { adobeTypekitClient } from './adobeTypekitClient';

describe('adobeTypekitClient (integration)', () => {
  const token = process.env.ADOBE_TYPEKIT_TOKEN || '';
  const kitId = 'jzl6jgi'; // Using the user's kit ID

  if (!token) {
    it.skip('skipping integration tests because ADOBE_TYPEKIT_TOKEN is not set', () => {});
    return;
  }

  const client = adobeTypekitClient(token);

  it('manages kit families', async () => {
    const familyId = 'tgkh'; // Octin Sports

    // @ts-ignore
    const result = await client.addFamilyToKit(kitId, familyId);
    expect(result).toBeDefined();
  });

  it('publishes kits', async () => {
    // @ts-ignore
    const result = await client.publishKit(kitId);
    expect(result).toBeDefined();
  });
});
