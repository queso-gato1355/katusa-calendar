# KATUSA Calendar Project

KATUSA Calendar는 카투사 복무 중 필요한 모든 일정을 한 눈에 확인할 수 있는 웹 애플리케이션입니다. 이 프로젝트는 Next.js와 Supabase를 기반으로 구축되었습니다.

## 목차

- [개요](#개요)
- [기능](#기능)
- [기술 스택](#기술-스택)
- [프로젝트 구조](#프로젝트-구조)
- [설치 및 실행](#설치-및-실행)
- [환경 변수](#환경-변수)
- [개발 가이드](#개발-가이드)
- [배포](#배포)
- [기여 방법](#기여-방법)
- [To-Do 리스트](#to-do-리스트)
- [라이센스](#라이센스)

## 개요

KATUSA Calendar는 카투사 복무 중 필요한 다양한 일정(휴가, 훈련, 행사 등)을 관리하고 구독할 수 있는 서비스입니다. 사용자는 웹 인터페이스를 통해 일정을 확인하거나 ICS 파일을 다운로드하여 자신의 캘린더 앱에 구독할 수 있습니다.

## 기능

- **캘린더 구독**: 다양한 카테고리의 일정을 ICS 형식으로 구독
- **웹 캘린더 뷰**: 웹에서 직접 일정 확인
- **관리자 대시보드**: 일정 관리, 사용자 관리, 설정 등
- **다국어 지원**: 한국어, 영어 지원
- **다크 모드**: 사용자 환경에 맞는 테마 제공

## 기술 스택

- **프론트엔드**: Next.js, React, TailwindCSS
- **백엔드**: Next.js API Routes
- **데이터베이스**: Supabase (PostgreSQL)
- **인증**: 자체 구현 인증 시스템 (이메일 인증 과정 도입 예정)
- **배포**: Vercel

## 프로젝트 구조

\`\`\`
katusa-calendar/
├── app/                    # Next.js App Router
│   ├── admin/              # 관리자 페이지
│   ├── api/                # API 라우트
│   ├── calendar/           # 웹 캘린더 페이지
│   ├── contact/            # 문의 페이지
│   ├── globals.css         # 전역 스타일
│   ├── layout.jsx          # 루트 레이아웃
│   └── page.jsx            # 메인 페이지
├── components/             # 리액트 컴포넌트
│   ├── admin/              # 관리자 관련 컴포넌트
│   ├── calendar/           # 캘린더 관련 컴포넌트
│   ├── layout/             # 레이아웃 컴포넌트
│   ├── sections/           # 메인 페이지 섹션 컴포넌트
│   └── ui/                 # UI 컴포넌트
├── data/                   # 정적 데이터
│   ├── admin-ui.js         # 관리자 UI 관련 데이터
│   ├── calendars.js        # 캘린더 정보
│   ├── faq.js              # FAQ 데이터
│   ├── features.js         # 기능 소개 데이터
│   ├── languages.js        # 언어 설정
│   └── translations.js     # 번역 데이터
├── lib/                    # 유틸리티 함수
│   ├── admin-auth.js       # 관리자 인증 관련
│   ├── ics-generator.js    # ICS 파일 생성
│   ├── supabaseClient.js   # Supabase 클라이언트
│   ├── supabaseAdmin.js    # Supabase 관리자 클라이언트
│   ├── supabaseServer.js   # Supabase 서버 클라이언트
│   ├── supabase-helpers.js # Supabase 헬퍼 함수
│   └── supabase-storage.js # Supabase 스토리지 관련
├── public/                 # 정적 파일
│   ├── KATUSA.jpg          # 이미지 파일
│   └── ...
├── services/               # 서비스 로직
│   └── calendar-service.js # 캘린더 관련 서비스
├── styles/                 # 추가 스타일
│   └── globals.css         # 전역 스타일
├── middleware.js           # Next.js 미들웨어
├── next.config.js          # Next.js 설정
├── package.json            # 패키지 정보
├── tailwind.config.js      # Tailwind CSS 설정
└── vercel.json             # Vercel 배포 설정
\`\`\`

## 설치 및 실행

1. 저장소 클론:
   \`\`\`bash
   git clone https://github.com/your-username/katusa-calendar.git
   cd katusa-calendar
   \`\`\`

2. 의존성 설치:
   \`\`\`bash
   npm install
   \`\`\`

3. 환경 변수 설정:
   `.env.local` 파일을 생성하고 필요한 환경 변수 설정 (아래 환경 변수 섹션 참조)

4. 개발 서버 실행:
   \`\`\`bash
   npm run dev
   \`\`\`

5. 브라우저에서 `http://localhost:3000` 접속

## 환경 변수

프로젝트 실행을 위해 다음 환경 변수가 필요합니다:

\`\`\`
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
SUPABASE_JWT_SECRET=your-supabase-jwt-secret

# 관리자 설정
ADMIN_JWT_SECRET=your-admin-jwt-secret
ADMIN_PASSWORD_SALT=your-admin-password-salt

# CRON 작업 설정
CRON_SECRET=your-cron-secret
NEXT_PUBLIC_CRON_SECRET=your-cron-secret
\`\`\`

## 개발 가이드

### 코드 스타일

- ESLint와 Prettier를 사용하여 코드 스타일 유지
- 컴포넌트는 기능별로 분리하여 관리
- 상태 관리는 React의 Context API 또는 useState/useEffect 사용

### 브랜치 전략

- `main`: 프로덕션 브랜치
- `develop`: 개발 브랜치
- 기능 개발: `feature/기능-이름`
- 버그 수정: `bugfix/버그-이름`

### 커밋 메시지 규칙

\`\`\`
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 수정
style: 코드 포맷팅, 세미콜론 누락 등 (코드 변경 없음)
refactor: 코드 리팩토링
test: 테스트 코드 추가
chore: 빌드 프로세스 또는 보조 도구 변경
\`\`\`

## 배포

이 프로젝트는 Vercel을 통해 배포됩니다:

1. Vercel에 GitHub 저장소 연결
2. 환경 변수 설정
3. 배포 설정 확인 후 배포

## 기여 방법

1. 이슈 확인 또는 새 이슈 생성
2. 브랜치 생성 (`feature/기능-이름` 또는 `bugfix/버그-이름`)
3. 코드 작성
4. 테스트 실행
5. Pull Request 생성
6. 코드 리뷰 후 병합

## To-Do 리스트

- [ ] 날짜 선택기 개선 (달력 UI를 사용한 직관적인 날짜 선택 기능 추가)
- [ ] 반복 일정 설정 (주간, 월간, 연간 등 반복되는 일정을 설정할 수 있는 기능 추가)
- [ ] 일괄 편집 기능 추가 (선택한 여러 항목을 한 번에 편집할 수 있는 기능 구현)
- [ ] 엑셀 가져오기/내보내기 (일정 데이터를 엑셀 형식으로 가져오기/내보내기 기능 추가)
- [ ] 드래그 앤 드롭 기능 추가 (일정을 드래그하여 날짜를 변경할 수 있는 기능 구현)
- [ ] 사용자 인증 시스템 개선 (보안 강화)
- [ ] 다국어 지원 확대 (추가 언어 지원)
- [ ] 모바일 UI/UX 개선
- [ ] 성능 최적화
- [ ] 단위 테스트 및 통합 테스트 추가

## 라이센스

이 프로젝트는 MIT 라이센스 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.
\`\`\`
