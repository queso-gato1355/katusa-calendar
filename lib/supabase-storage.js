import { supabaseAdmin } from "./supabaseAdmin"

const supabase = supabaseAdmin

/**
 * Supabase Storage에 파일 업로드
 * @param {string} bucket - 버킷 이름
 * @param {string} path - 저장 경로
 * @param {string|Blob|File} fileContent - 파일 내용
 * @param {Object} options - 업로드 옵션
 * @returns {Promise<Object>} - 업로드 결과
 */
export async function uploadToStorage(bucket, path, fileContent, options = {}) {
  try {
    const { data, error } = await supabase.storage.from(bucket).upload(path, fileContent, {
      contentType: options.contentType || "application/octet-stream",
      upsert: options.upsert || false,
      ...options,
    })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error uploading to Supabase Storage:", error)
    return { data: null, error }
  }
}

/**
 * Supabase Storage에서 파일 다운로드
 * @param {string} bucket - 버킷 이름
 * @param {string} path - 파일 경로
 * @returns {Promise<Object>} - 다운로드 결과
 */
export async function downloadFromStorage(bucket, path) {
  try {
    const { data, error } = await supabase.storage.from(bucket).download(path)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error downloading from Supabase Storage:", error)
    return { data: null, error }
  }
}

/**
 * Supabase Storage에서 파일의 공개 URL 가져오기
 * @param {string} bucket - 버킷 이름
 * @param {string} path - 파일 경로
 * @returns {Object} - 공개 URL 정보
 */
export function getPublicUrl(bucket, path) {
  return supabase.storage.from(bucket).getPublicUrl(path)
}
