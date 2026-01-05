import { createApp } from './app.ts';
import { fontController } from './fonts/controllers/fontController.ts';
import { listFontsCommand } from './fonts/use-cases/listFontsCommand.ts';
import { fontRepository } from './fonts/repositories/fontRepository.ts';
import { adobeTypekitClient } from './fonts/data/adobeTypekitClient.ts';
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
