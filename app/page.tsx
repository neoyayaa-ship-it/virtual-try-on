'use client';

import { useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import axios from 'axios';
import ImageUploader from '@/components/ImageUploader';
import CategorySelector from '@/components/CategorySelector';
import FitSelector from '@/components/FitSelector';
import LoadingSpinner from '@/components/LoadingSpinner';
import ResultDisplay from '@/components/ResultDisplay';
import ErrorToast from '@/components/ErrorToast';
import Header from '@/components/Header';
import type { Category, FitType, UploadedImage } from '@/types';

type Status = 'idle' | 'generating' | 'success' | 'error';

const TIMEOUT_DURATION = 30000;

export default function Home() {
  const { isSignedIn } = useUser();
  const [personImage, setPersonImage] = useState<UploadedImage | null>(null);
  const [clothingImage, setClothingImage] = useState<UploadedImage | null>(null);
  const [category, setCategory] = useState<Category>('top');
  const [fit, setFit] = useState<FitType | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [resultImage, setResultImage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const resetState = useCallback(() => {
    setStatus('idle');
    setResultImage('');
    setError('');
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!personImage || !clothingImage) {
      setError('请先上传两张图片');
      return;
    }

    setStatus('generating');
    setError('');

    try {
      const response = await axios.post('/api/tryon', {
        personImage: personImage!.base64,
        clothingImage: clothingImage!.base64,
        category,
        fit,
      }, {
        timeout: TIMEOUT_DURATION,
      });

      if (response.data.success && response.data.resultImage) {
        setResultImage(response.data.resultImage);
        setStatus('success');
      } else {
        setError(response.data.error || '生成失败');
        setStatus('error');
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        if (err.code === 'ECONNABORTED') {
          setError('请求超时，请稍后重试');
        } else {
          setError(err.response?.data?.error || '网络请求失败');
        }
      } else {
        setError('未知错误');
      }
      setStatus('error');
    }
  }, [personImage, clothingImage, category, fit, isSignedIn]);

  const handleTimeout = useCallback(() => {
    setError('请求超时，请稍后重试');
    setStatus('error');
  }, []);

  const canGenerate = personImage && clothingImage && status !== 'generating';

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {!isSignedIn && (
        <div className="bg-[#fff9e6] border-b border-[#f0e6c0]">
          <div className="max-w-5xl mx-auto px-6 py-3">
            <p className="text-sm text-[#8a7533] text-center">
              你正在以游客身份体验，
              <Link href="/sign-in" className="text-[#1a1a1a] underline hover:no-underline">
                登录后可保存记录
              </Link>
            </p>
          </div>
        </div>
      )}
      {error && <ErrorToast message={error} onClose={() => setError('')} />}

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <p className="text-sm text-[#6b6b6b]">上传照片和服装图，AI 生成试穿效果</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1a1a1a]">人物照片</label>
            <ImageUploader
              hint="上传清晰的人物照片"
              value={personImage}
              onChange={setPersonImage}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1a1a1a]">服装图片</label>
            <ImageUploader
              hint="上传商品图或服装照片"
              value={clothingImage}
              onChange={setClothingImage}
            />
          </div>
        </div>

        <div className="bg-[#f7f7f5] rounded-2xl p-6 mb-8">
          <div className="space-y-6">
            <CategorySelector
              value={category}
              onChange={setCategory}
              disabled={status === 'generating'}
            />

            <FitSelector
              value={fit}
              onChange={setFit}
              disabled={status === 'generating'}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!canGenerate}
          className={`
            w-full py-4 rounded-xl font-medium text-sm transition-all duration-200
            ${status === 'generating'
              ? 'bg-[#f7f7f5] text-[#6b6b6b] cursor-not-allowed'
              : canGenerate
                ? 'bg-[#1a1a1a] text-white hover:bg-[#333333]'
                : 'bg-[#e5e5e5] text-[#9a9a9a] cursor-not-allowed'
            }
          `}
        >
          {status === 'generating' ? '生成中...' : '生成换装效果'}
        </button>

        {status === 'generating' && (
          <div className="mt-4">
            <div className="h-1 bg-[#e5e5e5] rounded-full overflow-hidden">
              <div className="h-full bg-[#1a1a1a] rounded-full animate-progress" />
            </div>
            <LoadingSpinner timeout={TIMEOUT_DURATION} onTimeout={handleTimeout} />
          </div>
        )}

        {status === 'success' && resultImage && (
          <div className="mt-8 animate-fade-in">
            <ResultDisplay imageUrl={resultImage} onRegenerate={resetState} />
          </div>
        )}

        <footer className="mt-16 pt-8 border-t border-[#e5e5e5] text-center">
          <p className="text-xs text-[#9a9a9a]">
            仅供娱乐参考，实际效果以实物为准
          </p>
        </footer>
      </div>
    </div>
  );
}
