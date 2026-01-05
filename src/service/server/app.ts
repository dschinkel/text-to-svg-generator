import Koa from 'koa';
import Router from 'koa-router';

export interface FontController {
  getFonts: () => Promise<any[]>;
}

export const createApp = (fontController: FontController) => {
  const app = new Koa();
  const router = new Router();

  router.get('/api/fonts', async (ctx) => {
    ctx.body = await fontController.getFonts();
  });

  app.use(router.routes()).use(router.allowedMethods());

  return app;
};
