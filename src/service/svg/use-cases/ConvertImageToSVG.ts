export interface ConvertImageToSVGRequest {
  imageData: string; // Base64 data URL
}

export interface ConvertImageToSVGResponse {
  baseSVG: string;
  tightOutlineSVG: string;
}

export const ConvertImageToSVG = async (
  imageConverter: { 
    traceImage: (buffer: Buffer) => Promise<string>,
    generateImageTightOutline: (svg: string) => string
  },
  request: ConvertImageToSVGRequest
): Promise<ConvertImageToSVGResponse> => {
  const parts = request.imageData.split(',');
  const base64Data = parts.length > 1 ? parts[1] : parts[0];
  const buffer = Buffer.from(base64Data, 'base64');
  
  const baseSVG = await imageConverter.traceImage(buffer);
  const tightOutlineSVG = imageConverter.generateImageTightOutline(baseSVG);

  return {
    baseSVG,
    tightOutlineSVG
  };
};
