import { getFAQByLanguage } from "@/lib/constants/faq"
import { getTranslation } from "@/lib/constants/translations"

export default function FAQSection({ theme, language = "ko" }) {
  // 현재 언어에 맞는 텍스트 가져오기
  const text = getTranslation("faq", language)
  // 현재 언어에 맞는 FAQ 데이터 가져오기
  const faqs = getFAQByLanguage(language)

  return (
    <section id="faq" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">{text.title}</h2>
            <p
              className={`max-w-[900px] ${
                theme === "dark" ? "text-gray-300" : "text-gray-600"
              } md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed`}
            >
              {text.description}
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl gap-6 py-12 grid-cols-1 lg:grid-cols-2">
          {Array.isArray(faqs) &&
            faqs.map((faq) => <FAQCard key={faq.id} theme={theme} question={faq.question} answer={faq.answer} />)}
        </div>
      </div>
    </section>
  )
}

function FAQCard({ theme, question, answer }) {
  return (
    <div
      className={`rounded-lg border ${
        theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      } shadow-sm`}
    >
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-2xl font-semibold leading-none tracking-tight break-keep">{question}</h3>
      </div>
      <div className="p-6 pt-0 break-keep">
        <p>{answer}</p>
      </div>
    </div>
  )
}
