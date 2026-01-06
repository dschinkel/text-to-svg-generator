import { createApp } from './app.ts';
import { fontController } from './fonts/controllers/fontController.ts';
import { listFontsCommand } from './fonts/use-cases/listFontsCommand.ts';
import { AddFont } from './fonts/use-cases/AddFont.ts';
import { fontRepository } from './fonts/repositories/fontRepository.ts';
import { adobeTypekitClient } from './fonts/data/adobeTypekitClient.ts';
import { SyncFontKit } from './fonts/use-cases/SyncFontKit.ts';
import { GenerateBaseSVG } from './svg/use-cases/GenerateBaseSVG';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'src/db/fonts.json');
const token = process.env.ADOBE_TYPEKIT_TOKEN || '';
const kitId = 'jzl6jgi';

if (!token) {
  console.warn('Warning: ADOBE_TYPEKIT_TOKEN is not set');
}

const client = adobeTypekitClient(token);
const repository = fontRepository(dbPath, client);

// Sync font kit on startup
SyncFontKit(repository, client, kitId)
  .then(() => console.log('Font kit synced successfully'))
  .catch(err => console.error('Failed to sync font kit:', err));

const boundGenerateBaseSVG = (text: string, fontId: string) => GenerateBaseSVG(repository, client, kitId, text, fontId);

const controller = fontController(listFontsCommand, AddFont, boundGenerateBaseSVG, repository, client, kitId);

const app = createApp(controller);
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
