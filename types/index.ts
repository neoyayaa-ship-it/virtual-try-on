export type Category = 'top' | 'bottom' | 'dress';

export type FitType = 'slim' | 'oversized';

export interface TryOnRequest {
  personImage: string;
  clothingImage: string;
  category: Category;
  fit?: FitType;
}

export interface TryOnResponse {
  success: boolean;
  resultImage?: string;
  error?: string;
}

export interface UploadedImage {
  file: File;
  base64: string;
}

export interface VolcApiResponse {
  model: string;
  created: number;
  data: Array<{
    url: string;
    size: string;
  }>;
  usage: {
    generated_images: number;
    output_tokens: number;
    total_tokens: number;
  };
}
