/**
 * Controller for SVG to Tight Outline conversion.
 */
export const svgToOutlineController = (generateSVGOutline: (svgString: string) => Promise<string>) => {
  return {
    generate: async (ctx: any) => {
      const { svgString } = ctx.request.body as { svgString: string };
      
      if (!svgString) {
        ctx.status = 400;
        ctx.body = { error: 'Missing svgString in request body' };
        return;
      }

      try {
        const outlineSvg = await generateSVGOutline(svgString);
        ctx.status = 200;
        ctx.body = { outlineSvg };
      } catch (error: any) {
        console.error('SVG to Outline Error:', error);
        ctx.status = 500;
        ctx.body = { error: error.message || 'Failed to generate SVG outline' };
      }
    }
  };
};
