// 자주 묻는 질문에 대한 데이터를 언어별로 정의
export const faqData = {
  ko: [
    {
      id: "ics",
      question: "ICS 링크란 무엇인가요?",
      answer:
        "ICS(Internet Calendar Subscription) 링크는 캘린더 데이터를 공유하기 위한 표준 형식입니다. 이 링크를 통해 Google, Apple, Outlook 등의 캘린더 앱에서 KATUSA Calendar를 구독할 수 있습니다.",
    },
    {
      id: "compatibility",
      question: "어떤 캘린더 앱과 호환되나요?",
      answer:
        "KATUSA Calendar는 Google Calendar, Apple Calendar, Microsoft Outlook, Mozilla Thunderbird 등 대부분의 주요 캘린더 애플리케이션과 호환됩니다.",
    },
    {
      id: "updates",
      question: "얼마나 자주 업데이트되나요?",
      answer:
        "KATUSA Calendar는 정기적으로 업데이트됩니다. 대부분의 캘린더 앱은 자동으로 ICS 구독을 업데이트하므로, 최신 일정을 항상 확인할 수 있습니다.",
    },
    {
      id: "free",
      question: "정말 무료인가요?",
      answer:
        "네, KATUSA Calendar는 완전히 무료로 제공됩니다. 별도의 가입이나 결제가 필요 없으며, 모든 기능을 제한 없이 이용할 수 있습니다.",
    },
    {
      id: "request",
      question: "내 부대 캘린더가 없어요. 추가해줄 수 있나요?",
      answer:
        "네, 지속적으로 새로운 부대 캘린더를 추가하고 있습니다. 필요한 부대 캘린더가 있으시면 GitHub 이슈를 통해 요청해주세요.",
    },
    {
      id: "error",
      question: "캘린더 정보가 잘못되었어요. 어떻게 해야 하나요?",
      answer:
        "캘린더 정보에 오류가 있거나 업데이트가 필요한 경우, GitHub 저장소에 이슈를 등록해주시면 빠르게 수정하겠습니다.",
    },
  ],
  en: [
    {
      id: "ics",
      question: "What is an ICS link?",
      answer:
        "An ICS (Internet Calendar Subscription) link is a standard format for sharing calendar data. Through this link, you can subscribe to KATUSA Calendar in calendar apps like Google, Apple, Outlook, etc.",
    },
    {
      id: "compatibility",
      question: "Which calendar apps are compatible?",
      answer:
        "KATUSA Calendar is compatible with most major calendar applications including Google Calendar, Apple Calendar, Microsoft Outlook, Mozilla Thunderbird, etc.",
    },
    {
      id: "updates",
      question: "How often is it updated?",
      answer:
        "KATUSA Calendar is updated regularly. Most calendar apps automatically update ICS subscriptions, so you can always check the latest schedule.",
    },
    {
      id: "free",
      question: "Is it really free?",
      answer:
        "Yes, KATUSA Calendar is completely free. No separate registration or payment is required, and all features can be used without restrictions.",
    },
    {
      id: "request",
      question: "My unit's calendar is not available. Can you add it?",
      answer:
        "Yes, we are continuously adding new unit calendars. If you need a specific unit calendar, please request it through a GitHub issue.",
    },
    {
      id: "error",
      question: "The calendar information is incorrect. What should I do?",
      answer:
        "If there are errors in the calendar information or updates are needed, please register an issue in the GitHub repository and we will fix it quickly.",
    },
  ],
  es: [
    {
      id: "ics",
      question: "¿Qué es un enlace ICS?",
      answer:
        "Un enlace ICS (Internet Calendar Subscription) es un formato estándar para compartir datos de calendario. A través de este enlace, puedes suscribirte al KATUSA Calendar en aplicaciones de calendario como Google, Apple, Outlook, etc.",
    },
    {
      id: "compatibility",
      question: "¿Con qué aplicaciones de calendario es compatible?",
      answer:
        "KATUSA Calendar es compatible con la mayoría de las aplicaciones de calendario principales, incluyendo Google Calendar, Apple Calendar, Microsoft Outlook, Mozilla Thunderbird, etc.",
    },
    {
      id: "updates",
      question: "¿Con qué frecuencia se actualiza?",
      answer:
        "KATUSA Calendar se actualiza regularmente. La mayoría de las aplicaciones de calendario actualizan automáticamente las suscripciones ICS, por lo que siempre puedes consultar el horario más reciente.",
    },
    {
      id: "free",
      question: "¿Es realmente gratis?",
      answer:
        "Sí, KATUSA Calendar es completamente gratuito. No se requiere registro ni pago adicional, y todas las funciones se pueden utilizar sin restricciones.",
    },
    {
      id: "request",
      question: "El calendario de mi unidad no está disponible. ¿Puedes agregarlo?",
      answer:
        "Sí, estamos agregando continuamente nuevos calendarios de unidades. Si necesitas un calendario de unidad específico, solicítalo a través de un problema en GitHub.",
    },
    {
      id: "error",
      question: "La información del calendario es incorrecta. ¿Qué debo hacer?",
      answer:
        "Si hay errores en la información del calendario o se necesitan actualizaciones, regístrate en el repositorio de GitHub y lo corregiremos rápidamente.",
    },
  ],
}

// 언어에 따른 FAQ 데이터 가져오기
export const getFAQByLanguage = (language) => {
  return faqData[language] || faqData.ko || []
}
