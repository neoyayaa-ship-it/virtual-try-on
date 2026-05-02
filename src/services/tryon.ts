import axios, { AxiosError } from 'axios';
import type { Category, FitType } from '@/types';

const VOLC_API_KEY = process.env.VOLC_API_KEY || '';
const VOLC_API_URL = process.env.VOLC_API_URL || '';
const VOLC_MODEL = process.env.VOLC_MODEL || '';
const API_TIMEOUT = parseInt(process.env.API_TIMEOUT || '25000', 10);

export interface TryOnResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
}

export interface TryOnService {
  generate: (
    personImage: string,
    clothingImage: string,
    category: Category,
    fit?: FitType
  ) => Promise<TryOnResponse>;
}

function buildPrompt(category: Category, fit?: FitType): string {
  const categoryMap = {
    top: '上半身',
    bottom: '下半身',
    dress: '全身套装',
  };
  
  const fitMap = {
    slim: '修身版型',
    oversized: '宽松版型',
  };

  const categoryPartMap = {
    top: '仅替换上半身服装',
    bottom: '仅替换下半身服装',
    dress: '替换人物全身的服装，包括上半身和下半身，适用于连衣裙、套装、整套运动服等需要整体替换的场景',
  };

  let prompt = `Do not add, modify, or transfer any accessories (necklaces, bracelets, earrings, bags) from the person image to the output. Only replace the specified garment category. Keep all other elements unchanged. 严格按照以下规则进行换装：1.${categoryPartMap[category]}，鞋子、配饰、发型等其他部位完全保持不变；2.严格保留图2商品图的原始款式、颜色、版型，不做任何创意改动；3.人物的脸、发型、姿势、背景必须与图1完全一致；4.保持服装颜色和比例准确。`;
  
  if (fit) {
    prompt += ` 目标版型：${fitMap[fit]}。`;
  }

  return prompt;
}

export const tryOnService: TryOnService = {
  generate: async (personImage, clothingImage, category, fit) => {
    console.log('[TryOnService] 开始生成换装请求');
    
    if (!VOLC_API_KEY || !VOLC_API_URL) {
      console.error('[TryOnService] API 配置缺失');
      return { success: false, error: '服务配置未完成' };
    }

    try {
      const prompt = buildPrompt(category, fit);
      console.log(`[TryOnService] Prompt: ${prompt}`);

      const response = await axios.post(
        VOLC_API_URL,
        {
          model: VOLC_MODEL,
          prompt,
          image: [personImage, clothingImage],
          sequential_image_generation: 'disabled',
          response_format: 'url',
          size: '2K',
          stream: false,
          watermark: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${VOLC_API_KEY}`,
          },
          timeout: API_TIMEOUT,
        }
      );

      console.log('[TryOnService] API 响应成功');
      
      if (response.data && response.data.data && response.data.data.length > 0) {
        const tempImageUrl = response.data.data[0].url;
        console.log(`[TryOnService] 生成临时图片URL: ${tempImageUrl}`);
        
        // 直接返回临时图片，R2 上传在后台异步处理
        return { success: true, imageUrl: tempImageUrl };
      } else {
        console.error('[TryOnService] API 返回数据格式异常');
        return { success: false, error: '生成结果格式异常' };
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        
        if (axiosError.code === 'ECONNABORTED') {
          console.error('[TryOnService] 请求超时');
          return { success: false, error: '请求超时，请稍后重试' };
        }

        const status = axiosError.response?.status;
        
        if (status === 401) {
          console.error('[TryOnService] 认证失败 - API Key 无效');
          return { success: false, error: '认证失败，请检查 API 配置' };
        }

        if (status === 429) {
          console.error('[TryOnService] 请求被限流');
          return { success: false, error: '请求过于频繁，请稍后再试' };
        }

        const responseData = axiosError.response?.data as { error?: { message?: string }, message?: string };
        const errorMessage = responseData?.error?.message || 
                           responseData?.message || 
                           'API 请求失败';
        console.error(`[TryOnService] API 错误 (${status}): ${errorMessage}`);
        return { success: false, error: errorMessage };
      }

      console.error('[TryOnService] 未知错误:', error);
      return { success: false, error: '系统异常，请稍后重试' };
    }
  },
};

export default tryOnService;
