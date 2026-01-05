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
      it('fetches and persists real fonts from adobe', async () => {
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
  });
});
