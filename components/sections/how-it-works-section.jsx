import { getTranslation } from "@/data/translations"

export default function HowItWorksSection({ theme, language = "ko" }) {
  // 현재 언어에 맞는 텍스트 가져오기
  const text = getTranslation("howItWorks", language)

  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
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
        {/* 애플 사용자에게 해당하는 내용 */}
        <h3 className="mt-12 text-2xl font-semibold text-center">
          {text.appleUsersTitle}
        </h3>
        <p className={`mt-2 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          {text.appleUsersDescription}
        </p>
        <div className="mx-auto grid max-w-5xl items-top gap-6 py-12 grid-cols-1 md:grid-cols-3">
          {text.steps.map((step, index) => (
            <StepCard key={index} theme={theme} number={index + 1} title={step.title} description={step.description} />
          ))}
        </div>
        {/* Android 사용자에게 해당하는 내용 */}
        <h3 className="mt-12 text-2xl font-semibold text-center">
          {text.androidUsersTitle}
        </h3>
        <p className={`mt-2 text-center ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          {text.androidUsersDescription}
        </p>
        <div className="mx-auto grid max-w-5xl items-top gap-6 py-12 grid-cols-1 md:grid-cols-3">
          {text.androidSteps.map((step, index) => (
            <StepCard key={index} theme={theme} number={index + 1} title={step.title} description={step.description} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StepCard({ theme, number, title, description }) {
  return (
    <div className="flex flex-col items-center space-y-4 text-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-full ${
          theme === "dark" ? "bg-blue-600" : "bg-blue-600"
        } text-3xl font-bold text-white`}
      >
        {number}
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className={`${theme === "dark" ? "text-gray-400" : "text-gray-500"} break-keep`}>{description}</p>
    </div>
  )
}
