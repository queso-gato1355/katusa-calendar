import { useLanguage, useTranslation } from "@/components/providers/language-provider"
import { useTheme } from "@/components/providers/theme-provider"
import { TextPlaceholder, useTextWithPlaceholder } from "@/components/atoms/Display/TextPlaceholder"

export default function HowItWorksSection() {
  const { theme } = useTheme()
  const { isChangingLanguage } = useLanguage()
  
  // 현재 언어에 맞는 텍스트 가져오기
  const text = useTranslation("howItWorks")
  
  // 텍스트 플레이스홀더 훅 사용
  const titleText = useTextWithPlaceholder(text.title, isChangingLanguage)
  const descriptionText = useTextWithPlaceholder(text.description, isChangingLanguage)
  const appleUsersTitleText = useTextWithPlaceholder(text.appleUsersTitle, isChangingLanguage)
  const appleUsersDescriptionText = useTextWithPlaceholder(text.appleUsersDescription, isChangingLanguage)
  const androidUsersTitleText = useTextWithPlaceholder(text.androidUsersTitle, isChangingLanguage)
  const androidUsersDescriptionText = useTextWithPlaceholder(text.androidUsersDescription, isChangingLanguage)

  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
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
        {/* 애플 사용자에게 해당하는 내용 */}
        <h3 className="mt-12 text-2xl font-semibold text-center">
          <TextPlaceholder isChanging={isChangingLanguage}>
            {appleUsersTitleText}
          </TextPlaceholder>
        </h3>
        <TextPlaceholder isChanging={isChangingLanguage}>
          <p className={`mt-2 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            {appleUsersDescriptionText}
          </p>
        </TextPlaceholder>
        <div className="mx-auto grid max-w-5xl items-top gap-6 py-12 grid-cols-1 md:grid-cols-3">
          {text.steps.map((step, index) => (
            <StepCard key={index} theme={theme} isChangingLanguage={isChangingLanguage} number={index + 1} title={step.title} description={step.description} />
          ))}
        </div>
        {/* Android 사용자에게 해당하는 내용 */}
        <h3 className="mt-12 text-2xl font-semibold text-center">
          <TextPlaceholder isChanging={isChangingLanguage}>
            {androidUsersTitleText}
          </TextPlaceholder>
        </h3>
        <TextPlaceholder isChanging={isChangingLanguage}>
          <p className={`mt-2 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
            {androidUsersDescriptionText}
          </p>
        </TextPlaceholder>
        <div className="mx-auto grid max-w-5xl items-top gap-6 py-12 grid-cols-1 md:grid-cols-3">
          {text.androidSteps.map((step, index) => (
            <StepCard key={index} theme={theme} isChangingLanguage={isChangingLanguage} number={index + 1} title={step.title} description={step.description} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepCard({ theme, number, title, description, isChangingLanguage }) {
  const titleText = useTextWithPlaceholder(title, isChangingLanguage)
  const descriptionText = useTextWithPlaceholder(description, isChangingLanguage)
  
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full ${
          theme === "dark" ? "bg-blue-600" : "bg-blue-600"
        } text-3xl font-bold text-white`}
      >
        {number}
      </div>
      <h3 className="text-xl font-bold">
        <TextPlaceholder isChanging={isChangingLanguage}>
          {titleText}
        </TextPlaceholder>
      </h3>
      <TextPlaceholder isChanging={isChangingLanguage}>
        <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} break-keep`}>
          {descriptionText}
        </p>
      </TextPlaceholder>
    </div>
  )
}
