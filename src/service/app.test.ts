/**
 * @jest-environment node
 */
import request from 'supertest';
import { createApp } from './app.ts';

describe('Server', () => {
  it('lists fonts', async () => {
    const fonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    const fakeController = {
      getFonts: async () => fonts,
      addFont: async () => ({})
    };

    const app = createApp(fakeController);
    const response = await request(app.callback()).get('/api/fonts');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fonts);
  });

  it('adds a font', async () => {
    const newFont = { id: 'campus-mn', name: 'Campus MN' };
    const fakeController = {
      getFonts: async () => [],
      addFont: async (name: string) => {
        if (name === 'Campus MN') return newFont;
        return null;
      }
    };

    const app = createApp(fakeController);
    const response = await request(app.callback())
      .post('/api/fonts')
      .send({ name: 'Campus MN' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(newFont);
  });
});
