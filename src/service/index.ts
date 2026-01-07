import { createApp } from './app.ts';
import { fontController } from './fonts/controllers/fontController.ts';
import { listFontsCommand } from './fonts/use-cases/listFontsCommand.ts';
import { AddFont } from './fonts/use-cases/AddFont.ts';
import { fontRepository } from './fonts/repositories/fontRepository.ts';
import { adobeTypekitClient } from './fonts/data/adobeTypekitClient.ts';
import { SyncFontKit } from './fonts/use-cases/SyncFontKit.ts';
import { GenerateBaseSVG } from './svg/use-cases/GenerateBaseSVG';
import { GenerateTightOutlineSVG } from './svg/use-cases/GenerateTightOutlineSVG';
import { GenerateOuterOutlineSVG } from './svg/use-cases/GenerateOuterOutlineSVG';
import { ConvertImageToSVG } from './svg/use-cases/ConvertImageToSVG';
import { imageController } from './svg/controllers/imageController';
import { traceImage, generateImageTightOutline } from './svg/domain/imageConverter';
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
const boundGenerateTightOutlineSVG = (text: string, fontId: string) => GenerateTightOutlineSVG(repository, client, kitId, text, fontId);
const boundGenerateOuterOutlineSVG = (text: string, fontId: string) => GenerateOuterOutlineSVG(repository, client, kitId, text, fontId);

const controller = fontController(
  listFontsCommand, 
  AddFont, 
  boundGenerateBaseSVG, 
  boundGenerateTightOutlineSVG,
  boundGenerateOuterOutlineSVG,
  repository, 
  client, 
  kitId
);

const imgConverter = { traceImage, generateImageTightOutline };
const boundConvertImageToSVG = (request: any) => ConvertImageToSVG(imgConverter, request);
const imgController = imageController(boundConvertImageToSVG);

const app = createApp(controller, imgController);
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
