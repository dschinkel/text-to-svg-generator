import { ConvertImageToSVGRequest } from '../use-cases/ConvertImageToSVG';

export const imageController = (
  convertImageToSVG: (request: ConvertImageToSVGRequest) => Promise<string>
) => {
  const convert = async (ctx: any): Promise<void> => {
    const request = ctx.request.body as ConvertImageToSVGRequest;
    
    if (!request.imageData) {
      ctx.status = 400;
      ctx.body = { error: 'Missing imageData' };
      return;
    }

    try {
      const svg = await convertImageToSVG(request);
      ctx.status = 200;
      ctx.type = 'image/svg+xml';
      ctx.body = svg;
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  };

  return {
    convert
  };
};
