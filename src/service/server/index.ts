import { createApp } from './app';
import { fontController } from '../fonts/controllers/fontController';
import { listFontsCommand } from '../fonts/use-cases/listFontsCommand';
import { fontRepository } from '../fonts/repositories/fontRepository';
import { adobeTypekitClient } from '../fonts/data/adobeTypekitClient';
import path from 'path';

const dbPath = path.resolve(process.cwd(), 'src/db/fonts.json');
const token = process.env.ADOBE_TYPEKIT_TOKEN || '';

if (!token) {
  console.warn('Warning: ADOBE_TYPEKIT_TOKEN is not set');
}

const client = adobeTypekitClient(token);
const repository = fontRepository(dbPath, client);
const command = listFontsCommand(repository);
const controller = fontController(command);

const app = createApp(controller);
const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
