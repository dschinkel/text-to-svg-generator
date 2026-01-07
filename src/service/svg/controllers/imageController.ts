import { ConvertImageToSVGRequest, ConvertImageToSVGResponse } from '../use-cases/ConvertImageToSVG';

export const imageController = (
  convertImageToSVG: (request: ConvertImageToSVGRequest) => Promise<ConvertImageToSVGResponse>
) => {
  const convert = async (ctx: any): Promise<void> => {
    const request = ctx.request.body as ConvertImageToSVGRequest;
    
    if (!request.imageData) {
      ctx.status = 400;
      ctx.body = { error: 'Missing imageData' };
      return;
    }

    try {
      const result = await convertImageToSVG(request);
      ctx.status = 200;
      ctx.body = result;
    } catch (error: any) {
      ctx.status = 500;
      ctx.body = { error: error.message };
    }
  };

  return {
    convert
  };
};
