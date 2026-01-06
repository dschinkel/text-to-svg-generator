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
      addFont: async () => ({}),
      getSVG: async () => null
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
      },
      getSVG: async () => null
    };

    const app = createApp(fakeController);
    const response = await request(app.callback())
      .post('/api/fonts')
      .send({ name: 'Campus MN' });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(newFont);
  });

  it('returns base svg', async () => {
    const fakeSVG = '<svg>test</svg>';
    const fakeController = {
      getFonts: async () => [],
      addFont: async () => ({}),
      getSVG: async (text: string, fontId: string) => {
        if (text === 'Hello' && fontId === 'octin-sports') return fakeSVG;
        return null;
      }
    } as any;

    const app = createApp(fakeController);
    const response = await request(app.callback())
      .get('/api/svg')
      .query({ text: 'Hello', fontId: 'octin-sports' });

    expect(response.status).toBe(200);
    expect(response.body.toString()).toBe(fakeSVG);
    expect(response.header['content-type']).toContain('image/svg+xml');
  });

  it('returns 404 if svg not found', async () => {
    const fakeController = {
      getFonts: async () => [],
      addFont: async () => ({}),
      getSVG: async () => null
    } as any;

    const app = createApp(fakeController);
    const response = await request(app.callback())
      .get('/api/svg')
      .query({ text: 'Unknown', fontId: 'none' });

    expect(response.status).toBe(404);
  });

  it('returns 400 if text is missing', async () => {
    const fakeController = {
      getFonts: async () => [],
      addFont: async () => ({}),
      getSVG: async () => null
    } as any;

    const app = createApp(fakeController);
    const response = await request(app.callback())
      .get('/api/svg')
      .query({ fontId: 'octin-sports' });

    expect(response.status).toBe(400);
  });
});
