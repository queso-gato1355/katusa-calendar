// components/molecules/BasicLoading/basic-loading.jsx
"use client"

export default function BasicLoading() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        {/* 메인 로딩 링 */}
        <div className="relative mb-8 w-32 h-32 mx-auto">
          {/* 정적 외부 링 */}
          <div className="absolute inset-0 border-4 border-border rounded-full"></div>
          {/* 회전하는 스피너 */}
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
          
          {/* 중앙 아이콘 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-card p-4 rounded-xl shadow-lg animate-pulse">
              <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* 브랜드 제목 */}
        <div className="space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground animate-fade-in">
            <span className="bg-foreground bg-clip-text text-transparent">
              KATUSA Calendar
            </span>
          </h1>
          <p className="text-lg text-muted-foreground animate-fade-in-delay">
            카투사 복무 일정을 확인하는 중...
          </p>
        </div>
        
        {/* 애니메이션 도트들 */}
        <div className="flex justify-center space-x-4 mb-6">
          <div className="w-3 h-3 bg-chart-1 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-chart-2 rounded-full animate-bounce animation-delay-100"></div>
          <div className="w-3 h-3 bg-chart-3 rounded-full animate-bounce animation-delay-200"></div>
          <div className="w-3 h-3 bg-chart-4 rounded-full animate-bounce animation-delay-300"></div>
        </div>
        
        {/* 스켈레톤 카드들 */}
        <div className="grid grid-cols-3 gap-3 opacity-20">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-card p-3 rounded-lg border animate-pulse"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              <div className="w-full h-2 bg-primary rounded mb-2"></div>
              <div className="w-2/3 h-2 bg-primary rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}