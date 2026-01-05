/**
 * @jest-environment node
 */
import request from 'supertest';
import { createApp } from './app.ts';

describe('server', () => {
  it('lists fonts', async () => {
    const fonts = [{ id: 'octin-sports', name: 'Octin Sports' }];
    const fakeController = {
      getFonts: jest.fn().mockResolvedValue(fonts)
    };

    const app = createApp(fakeController);
    const response = await request(app.callback()).get('/api/fonts');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(fonts);
  });
});
