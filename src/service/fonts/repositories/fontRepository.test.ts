import * as fs from 'fs';
import * as path from 'path';
import { fontRepository } from './fontRepository';
import { adobeTypekitClient } from '../data/adobeTypekitClient';

describe('Font Repository Integration', () => {
  const dbPath = path.resolve(__dirname, '../../../../db/fonts-integration-test.json');
  const token = process.env.ADOBE_TYPEKIT_TOKEN;

  beforeEach(() => {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  afterAll(() => {
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  });

  describe('integration', () => {
      it('fetches real fonts from adobe', async () => {
        const client = adobeTypekitClient(token);
        const repository = fontRepository(dbPath, client);

        await repository.fetch('octin-sports');
        await repository.fetch('campus-mn');
        
        const savedFonts = await repository.getAll();

        expect(savedFonts).toContainEqual(expect.objectContaining({
          slug: 'octin-sports'
        }));
        expect(savedFonts).toContainEqual(expect.objectContaining({
          slug: 'campus-mn'
        }));
      });

      it('fetches cholla font from adobe', async () => {
        const client = adobeTypekitClient(token);
        const repository = fontRepository(dbPath, client);

        const font = await repository.fetch('cholla');
        
        expect(font).toBeDefined();
        expect(font?.slug).toBe('cholla-sans');
      });

      it('fetches family with multiple variations', async () => {
        const client = adobeTypekitClient(token);
        const repository = fontRepository(dbPath, client);

        const font = await repository.fetch('cholla');
        
        expect(font).toBeDefined();
        expect(font.name).toBe('Cholla');
        expect(font.variations).toBeDefined();
        // Should contain variations from both Cholla Sans (ymsq) and Cholla Wide (zgyk)
        expect(font.variations).toContainEqual(expect.objectContaining({
          id: 'zgyk:n8',
          name: 'Cholla Wide Ultra Bold'
        }));
        expect(font.variations).toContainEqual(expect.objectContaining({
          id: 'ymsq:n7',
          name: 'Cholla Sans  Bold'
        }));
      });
  });
});
