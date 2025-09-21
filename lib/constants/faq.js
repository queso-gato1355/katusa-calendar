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
      question: "업데이트가 너무 느려요.",
      answer:
        "캘린더 정보 업데이트는 수기로 이루어집니다. 짧게는 일주일, 길게는 4주 정도 지체될 수 있으니 양해 부탁드립니다.",
    },
    {
      id: "error",
      question: "캘린더 정보가 잘못되었어요. 어떻게 해야 하나요?",
      answer:
        "캘린더 정보에 오류가 있거나 업데이트가 필요한 경우, 이메일 문의를 통해 문제점을 알려주세요.",
    },
    {
      id: "how-to-update-apple",
      question: "Apple 캘린더에서 ICS 링크를 수동으로 업데이트하려면 어떻게 해야 하나요?",
      answer:
        "Apple 캘린더에서 ICS 링크를 수동으로 업데이트하려면, 캘린더 앱을 열고 구독 중인 캘린더를 선택한 후, '캘린더 정보'에서 '새로 고침' 버튼을 클릭하면 됩니다. 이 방법으로 최신 일정이 자동으로 반영됩니다.",
    },
    {
      id: "how-to-update-android",
      question: "Android 캘린더에서 ICS 링크를 수동으로 업데이트하려면 어떻게 해야 하나요?",
      answer:
        "Android 캘린더에서 ICS 링크를 수동으로 업데이트하려면, 기존에 다운받은 캘린더를 삭제한 후, 새로운 파일을 다운받은 후 다시 파일에 추가하면 됩니다.",
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
      question: "Why is the update so slow?",
      answer:
        "KATUSA Calendar updates are done manually. It may take from a week to 4 weeks to reflect the changes, so we appreciate your understanding.",
    },
    {
      id: "error",
      question: "The calendar information is incorrect. What should I do?",
      answer:
        "If there are errors in the calendar information or updates are needed, please email us to let us know.",
    },
    {
      id: "how-to-update-apple",
      question: "How to manually update the ICS link in Apple Calendar?",
      answer:
        "To manually update the ICS link in Apple Calendar, open the Calendar app, select the subscribed calendar, and click the 'Refresh' button in 'Calendar Info'. This will automatically reflect the latest schedule.",
    },
    {
      id: "how-to-update-android",
      question: "How to manually update the ICS link in Android Calendar?",
      answer:
        "To manually update the ICS link in Android Calendar, delete the existing calendar and then download and add the new file again.",
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
      question: "¿Por qué la actualización es tan lenta?",
      answer:
        "KATUSA Calendar se actualiza manualmente. Puede tardar de una semana a 4 semanas en reflejar los cambios, por lo que agradecemos tu comprensión.",
    },
    {
      id: "error",
      question: "La información del calendario es incorrecta. ¿Qué debo hacer?",
      answer:
        "Si hay errores en la información del calendario o se necesitan actualizaciones, envíanos un correo electrónico para informarnos.",
    },
    {
      id: "how-to-update-apple",
      question: "¿Cómo actualizar manualmente el enlace ICS en Apple Calendar?",
      answer:
        "Para actualizar manualmente el enlace ICS en Apple Calendar, abre la aplicación de calendario, selecciona el calendario suscrito y haz clic en el botón 'Actualizar' en 'Información del Calendario'. Esto reflejará automáticamente el horario más reciente.",
    },
    {
      id: "how-to-update-android",
      question: "¿Cómo actualizar manualmente el enlace ICS en Android Calendar?",
      answer:
        "Para actualizar manualmente el enlace ICS en Android Calendar, elimina el calendario existente y luego descarga y agrega el nuevo archivo nuevamente.",
    },
  ],
}

// 언어에 따른 FAQ 데이터 가져오기
export const getFAQByLanguage = (language) => {
  return faqData[language] || faqData.ko || []
}
