import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

export interface FontController {
  getFonts: () => Promise<any[]>;
  addFont: (name: string) => Promise<any>;
  getBaseSVG: (text: string, fontId: string) => Promise<string | null>;
}

export const createApp = (fontController: FontController) => {
  const app = new Koa();
  const router = new Router();

  app.use(bodyParser());

  router.get('/api/svg', async (ctx) => {
    const { text, fontId } = ctx.query as { text: string; fontId: string };
    
    if (!text || !fontId) {
      ctx.status = 400;
      ctx.body = 'Missing text or fontId query parameter';
      return;
    }

    const svg = await fontController.getBaseSVG(text, fontId);
    
    if (svg === null || svg === undefined) {
      ctx.status = 404;
      ctx.body = `SVG Not Found for text="${text}" and fontId="${fontId}"`;
      return;
    }

    ctx.status = 200;
    ctx.type = 'image/svg+xml';
    ctx.body = svg;
  });

  router.get('/api/fonts', async (ctx) => {
    ctx.body = await fontController.getFonts();
  });

  router.post('/api/fonts', async (ctx) => {
    const { name } = ctx.request.body as { name: string };
    const font = await fontController.addFont(name);
    ctx.status = 201;
    ctx.body = font;
  });

  app.use(router.routes()).use(router.allowedMethods());

  return app;
};
