import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center">
      {/* 产品展示区域 */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* 大标题 */}
        <h1 className="text-4xl md:text-5xl font-bold text-center text-[#1a1a1a] mb-3">
          虚拟试衣
        </h1>
        
        {/* 产品介绍 */}
        <p className="text-base md:text-lg text-center text-[#6b6b6b] mb-8 max-w-xl mx-auto">
          上传你的照片和服装图，AI 自动生成试穿效果，购物更轻松
        </p>
        
        {/* 产品示例展示区域 */}
        <div className="max-w-xl mx-auto mb-8">
          {/* 示例卡片 */}
          <div className="bg-white rounded-2xl shadow-md p-5 border border-[#f0f0f0]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#1a1a1a]"></div>
              <span className="text-xs font-medium text-[#1a1a1a]">效果示例</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <div className="h-32 bg-[#f0f0f0] rounded-lg flex items-center justify-center">
                  <span className="text-[#6b6b6b] text-xs">人物</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-[#9a9a9a] text-base">+</span>
              </div>
              <div className="flex-1">
                <div className="h-32 bg-[#e5e5e5] rounded-lg flex items-center justify-center">
                  <span className="text-[#6b6b6b] text-xs">服装</span>
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-[#9a9a9a] text-base">→</span>
              </div>
              <div className="flex-1">
                <div className="h-32 bg-[#d4edf1] rounded-lg flex items-center justify-center">
                  <span className="text-[#1a1a1a] text-xs font-medium">试穿</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 两个按钮 */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center px-7 py-2.5 bg-[#1a1a1a] text-white rounded-xl font-medium text-sm transition-all hover:bg-[#333333]"
          >
            立即登录
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-7 py-2.5 border-2 border-[#e5e5e5] text-[#6b6b6b] rounded-xl font-medium text-sm transition-all hover:border-[#1a1a1a] hover:text-[#1a1a1a]"
          >
            不登录，直接体验
          </Link>
        </div>
      </div>
    </div>
  );
}
