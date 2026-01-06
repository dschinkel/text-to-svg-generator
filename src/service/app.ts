import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';

export interface FontController {
  getFonts: () => Promise<any[]>;
  addFont: (name: string) => Promise<any>;
}

export const createApp = (fontController: FontController) => {
  const app = new Koa();
  const router = new Router();

  app.use(bodyParser());

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
