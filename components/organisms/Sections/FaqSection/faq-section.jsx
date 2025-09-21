import { getFAQByLanguage } from "@/lib/constants/faq"
import { useLanguage, useTranslation } from "@/components/providers/language-provider"
import { useTheme } from "@/components/providers/theme-provider"
import { TextPlaceholder, useTextWithPlaceholder } from "@/components/atoms/Display/TextPlaceholder"

export default function FAQSection() {
  const { theme } = useTheme()
  const { language, isChangingLanguage } = useLanguage()
  
  // 현재 언어에 맞는 텍스트 가져오기
  const text = useTranslation("faq")
  // 현재 언어에 맞는 FAQ 데이터 가져오기
  const faqs = getFAQByLanguage(language)
  
  // 텍스트 플레이스홀더 훅 사용
  const titleText = useTextWithPlaceholder(text.title, isChangingLanguage)
  const descriptionText = useTextWithPlaceholder(text.description, isChangingLanguage)

  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
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
        <div className="mx-auto grid max-w-5xl gap-6 py-12 grid-cols-1 lg:grid-cols-2">
          {Array.isArray(faqs) &&
            faqs.map((faq) => <FAQCard key={faq.id} theme={theme} isChangingLanguage={isChangingLanguage} question={faq.question} answer={faq.answer} />)}
        </div>
      </div>
    </section>
  )
}

function FAQCard({ theme, question, answer, isChangingLanguage }) {
  const questionText = useTextWithPlaceholder(question, isChangingLanguage)
  const answerText = useTextWithPlaceholder(answer, isChangingLanguage)
  
  return (
    <div
      className={`rounded-lg border ${
        theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      } shadow-sm`}
    >
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight break-keep">
          <TextPlaceholder isChanging={isChangingLanguage}>
            {questionText}
          </TextPlaceholder>
        </h3>
      </div>
      <div className="p-6 pt-0 break-keep">
        <TextPlaceholder isChanging={isChangingLanguage}>
          <p>
            {answerText}
          </p>
        </TextPlaceholder>
      </div>
    </div>
  )
}
