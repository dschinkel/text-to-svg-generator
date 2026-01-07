import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

export interface FontController {
  getFonts: () => Promise<any[]>;
  addFont: (name: string) => Promise<any>;
  getSVG: (text: string, fontId: string, type: string) => Promise<string | null>;
}

export interface ImageController {
  convert: (ctx: any) => Promise<void>;
}

export interface SVGToOutlineController {
  generate: (ctx: any) => Promise<void>;
}

export const createApp = (
  fontController: FontController, 
  imageController: ImageController,
  svgToOutlineController: SVGToOutlineController
) => {
  const app = new Koa();
  const router = new Router();

  app.use(bodyParser({
    jsonLimit: '10mb',
    formLimit: '10mb'
  }));

  router.get('/api/svg', async (ctx) => {
    const { text, fontId, type = 'base' } = ctx.query as { text: string; fontId: string; type?: string };
    
    if (!text || (!fontId && text !== 'DEBUG')) {
      ctx.status = 400;
      ctx.body = 'Missing text or fontId query parameter';
      return;
    }

    const svg = await fontController.getSVG(text, fontId, type);
    
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
    if (!font) {
      ctx.status = 404;
      ctx.body = { error: `Font "${name}" not found in Adobe library` };
      return;
    }
    ctx.status = 201;
    ctx.body = font;
  });
  
  router.post('/api/image-to-svg', async (ctx) => {
    await imageController.convert(ctx);
  });

  router.post('/api/svg-to-outline', async (ctx) => {
    await svgToOutlineController.generate(ctx);
  });

  app.use(router.routes()).use(router.allowedMethods());

  return app;
};
