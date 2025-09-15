import { getFeaturesByLanguage } from "@/lib/constants/features"
import { useLanguage, useTranslation } from "@/components/providers/language-provider"
import { useTheme } from "@/components/providers/theme-provider"
import { TextPlaceholder, useTextWithPlaceholder } from "@/components/atoms/Display/TextPlaceholder"

export default function FeaturesSection() {
  const { theme } = useTheme()
  const { language, isChangingLanguage } = useLanguage()
  
  // 현재 언어에 맞는 텍스트 가져오기
  const text = useTranslation("features")
  // 현재 언어에 맞는 기능 데이터 가져오기
  const features = getFeaturesByLanguage(language)
  
  // 텍스트 플레이스홀더 훅 사용
  const badgeText = useTextWithPlaceholder(text.badge, isChangingLanguage)
  const titleText = useTextWithPlaceholder(text.title, isChangingLanguage)
  const descriptionText = useTextWithPlaceholder(text.description, isChangingLanguage)

  return (
    <section
      id="features"
      className={`w-full py-12 md:py-24 lg:py-32 ${theme === "dark" ? "bg-gray-800/40" : "bg-gray-100/40"}`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div
              className={`inline-block rounded-lg px-3 py-1 text-sm ${
                theme === "dark" ? "bg-blue-600 text-white" : "bg-blue-600 text-white"
              }`}
            >
              <TextPlaceholder isChanging={isChangingLanguage}>
                {badgeText}
              </TextPlaceholder>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              <TextPlaceholder isChanging={isChangingLanguage}>
                {titleText}
              </TextPlaceholder>
            </h2>
            <TextPlaceholder isChanging={isChangingLanguage}>
              <p
                className={`max-w-[900px] ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                } md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}
              >
                {descriptionText}
              </p>
            </TextPlaceholder>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature Cards */}
          {Array.isArray(features) &&
            features.map((feature) => (
              <FeatureCard
                key={feature.id}
                theme={theme}
                isChangingLanguage={isChangingLanguage}
                icon={
                  <feature.icon className={`h-10 w-10 ${theme === "dark" ? "text-blue-400" : "text-blue-600"} mb-4`} />
                }
                title={feature.title}
                description={feature.description}
              />
            ))}
        </div>
      </div>
    </section>
  )
}

function FeatureCard({ theme, icon, title, description, isChangingLanguage }) {
  const titleText = useTextWithPlaceholder(title, isChangingLanguage)
  const descriptionText = useTextWithPlaceholder(description, isChangingLanguage)
  
  return (
    <div
      className={`rounded-lg border ${
        theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      } shadow-sm flex flex-col md:h-[220px] lg:h-[240px]`}
    >
      <div className="flex flex-col space-y-1.5 p-6 flex-grow">
        {icon}
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          <TextPlaceholder isChanging={isChangingLanguage}>
            {titleText}
          </TextPlaceholder>
        </h3>
        <TextPlaceholder isChanging={isChangingLanguage}>
          <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
            {descriptionText}
          </p>
        </TextPlaceholder>
      </div>
    </div>
  )
}
