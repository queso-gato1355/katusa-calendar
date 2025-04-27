import { getFeaturesByLanguage } from "@/data/features"
import { getTranslation } from "@/data/translations"

export default function FeaturesSection({ theme, language = "ko" }) {
  // 현재 언어에 맞는 텍스트 가져오기
  const text = getTranslation("features", language)
  // 현재 언어에 맞는 기능 데이터 가져오기
  const features = getFeaturesByLanguage(language)

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
              {text.badge}
            </div>
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
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {/* Feature Cards */}
          {features.map((feature) => (
            <FeatureCard
              key={feature.id}
              theme={theme}
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

function FeatureCard({ theme, icon, title, description }) {
  return (
    <div
      className={`rounded-lg border ${
        theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      } shadow-sm flex flex-col md:h-[220px] lg:h-[240px]`}
    >
      <div className="flex flex-col space-y-1.5 p-6 flex-grow">
        {icon}
        <h3 className="text-2xl font-semibold leading-none tracking-tight">{title}</h3>
        <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{description}</p>
      </div>
    </div>
  )
}
