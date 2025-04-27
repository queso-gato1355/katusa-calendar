// 지원하는 언어 목록
export const languages = [
  {
    code: "ko",
    name: "한국어",
    flag: "🇰🇷",
    isDefault: true,
  },
  {
    code: "en",
    name: "English",
    flag: "🇺🇸",
  },
  {
    code: "ja",
    name: "日本語",
    flag: "🇯🇵",
  },
  {
    code: "zh",
    name: "中文",
    flag: "🇨🇳",
  },
]

// 기본 언어 가져오기
export const getDefaultLanguage = () => {
  return languages.find((lang) => lang.isDefault) || languages[0]
}

// 언어 코드로 언어 정보 가져오기
export const getLanguageByCode = (code) => {
  return languages.find((lang) => lang.code === code) || getDefaultLanguage()
}
