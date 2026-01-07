export interface ConvertImageToSVGRequest {
  imageData: string; // Base64 data URL
}

export const ConvertImageToSVG = async (
  imageConverter: { traceImage: (buffer: Buffer) => Promise<string> },
  request: ConvertImageToSVGRequest
): Promise<string> => {
  const base64Data = request.imageData.split(',')[1];
  const buffer = Buffer.from(base64Data, 'base64');
  return await imageConverter.traceImage(buffer);
};
