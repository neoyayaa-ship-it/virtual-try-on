'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Header from '@/components/Header';
import Link from 'next/link';

type HistoryItem = {
  id: string;
  clothingImageUrl: string;
  personImageUrl: string;
  resultImageUrl: string;
  createdAt: string;
};

export default function HistoryPage() {
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const [histories, setHistories] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/');
      return;
    }

    if (isLoaded && isSignedIn) {
      fetchHistory();
    }
  }, [isLoaded, isSignedIn, router]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('[History] 开始获取历史记录');
      
      const response = await axios.get('/api/history');
      console.log('[History] API 响应:', response.data);
      
      if (response.data.success && response.data.histories) {
        setHistories(response.data.histories);
      } else {
        setError(response.data.error || '获取历史记录失败');
      }
    } catch (err) {
      console.error('[History] 获取历史记录失败:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('请先登录');
        } else {
          setError(err.response?.data?.error || '网络请求失败');
        }
      } else {
        setError('未知错误');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-[#6b6b6b]">加载中...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">我的试衣历史</h1>
          <p className="text-[#6b6b6b]">查看你之前生成的所有试衣效果</p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-[#6b6b6b]">加载中...</p>
          </div>
        )}

        {error && (
          <div className="bg-[#fff5f5] border border-[#f0c0c0] rounded-2xl p-4 mb-6">
            <p className="text-[#c0392b]">{error}</p>
            <button
              onClick={fetchHistory}
              className="mt-2 text-sm text-[#1a1a1a] underline hover:no-underline"
            >
              重试
            </button>
          </div>
        )}

        {!loading && !error && histories.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-[#f7f7f5] rounded-2xl p-8">
              <p className="text-[#6b6b6b] mb-4">你还没有生成过试衣效果</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#333333] transition-colors"
              >
                开始试衣
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && histories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {histories.map((history) => (
              <div
                key={history.id}
                className="bg-white border border-[#e5e5e5] rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={history.resultImageUrl}
                    alt="试衣效果"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <p className="text-xs text-[#9a9a9a]">
                    {formatDate(history.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
