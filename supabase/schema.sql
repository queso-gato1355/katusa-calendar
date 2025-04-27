-- 캘린더 설정 테이블
CREATE TABLE IF NOT EXISTS calendar_settings (
  calendar_id TEXT PRIMARY KEY,
  is_active BOOLEAN DEFAULT true,
  copy_count INTEGER DEFAULT 0
);

-- 사이트 설정 테이블
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- 문의 테이블
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending',
  response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE
);
