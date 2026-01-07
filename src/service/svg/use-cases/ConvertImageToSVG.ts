export interface ConvertImageToSVGRequest {
  imageData: string; // Base64 data URL
}

export const ConvertImageToSVG = async (
  imageConverter: { traceImage: (buffer: Buffer) => Promise<string> },
  request: ConvertImageToSVGRequest
): Promise<string> => {
  const parts = request.imageData.split(',');
  const base64Data = parts.length > 1 ? parts[1] : parts[0];
  const buffer = Buffer.from(base64Data, 'base64');
  return await imageConverter.traceImage(buffer);
};
