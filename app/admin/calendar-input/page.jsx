"use client";

// TODO: 어떤 계정이 그 일정을 입력했는지도 정보에 추가.

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/providers/theme-provider";
import { validateSession } from "@/lib/api/auth";
import FiscalYearForm from "@/components/organisms/Forms/FiscalYearForm/fiscal-year-form";

export default function CalendarInputPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 인증 상태 확인
  useEffect(() => {
    if (mounted) {
      checkAuthentication();
    }
  }, [mounted]);

  const checkAuthentication = async () => {
    try {
      // 세션 쿠키에서 토큰 가져오기
      const cookies = document.cookie.split(";").reduce((acc, cookie) => {
        const [key, value] = cookie.trim().split("=");
        acc[key] = value;
        return acc;
      }, {});

      const sessionToken = cookies["admin_session"];

      if (!sessionToken) {
        // 세션이 없으면 로그인 페이지로 리디렉션
        router.push("/admin/login");
        return;
      }

      // 세션 검증
      const user = await validateSession(sessionToken);

      if (!user) {
        // 세션이 유효하지 않으면 로그인 페이지로 리디렉션
        router.push("/admin/login");
        return;
      }

      // 인증 성공
      setIsAuthenticated(true);
      setLoading(false);
    } catch (error) {
      console.error("Authentication error:", error);
      router.push("/admin/login");
    }
  };

  // 마운트되지 않았거나 인증되지 않은 경우 로딩 표시
  if (!mounted || loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">      
      <FiscalYearForm theme={theme} />
    </div>
  );
}
