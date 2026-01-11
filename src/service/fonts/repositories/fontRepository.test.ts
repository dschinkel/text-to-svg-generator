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

      it('removes a font', async () => {
        const client = adobeTypekitClient(token);
        const repository = fontRepository(dbPath, client);

        await repository.save({ id: 'to-be-removed', name: 'Remove Me' });
        let fonts = await repository.getAll();
        expect(fonts).toContainEqual(expect.objectContaining({ id: 'to-be-removed' }));

        await repository.remove('to-be-removed');
        fonts = await repository.getAll();
        expect(fonts).not.toContainEqual(expect.objectContaining({ id: 'to-be-removed' }));
      });

      it('prevents duplicate saves of same font family', async () => {
        const client = adobeTypekitClient(token);
        const repository = fontRepository(dbPath, client);

        const f1 = { id: 'id1', name: 'Duplicate Font', slug: 'duplicate-font' };
        const f2 = { id: 'id2', name: 'Duplicate Font', slug: 'duplicate-font' };

        await repository.save(f1);
        let fonts = await repository.getAll();
        expect(fonts).toHaveLength(1);

        await repository.save(f2);
        fonts = await repository.getAll();
        expect(fonts).toHaveLength(1);
        expect(fonts[0].id).toBe('id2'); // Should overwrite
      });
  });
});
