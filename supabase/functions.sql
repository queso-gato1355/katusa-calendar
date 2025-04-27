-- 복사 카운트 증가 함수
CREATE OR REPLACE FUNCTION increment_copy_count(calendar_id TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO calendar_settings (calendar_id, copy_count, is_active)
  VALUES (calendar_id, 1, true)
  ON CONFLICT (calendar_id) 
  DO UPDATE SET copy_count = calendar_settings.copy_count + 1;
END;
$$;
