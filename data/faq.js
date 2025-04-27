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
  ja: [
    {
      id: "ics",
      question: "ICSリンクとは何ですか？",
      answer:
        "ICS（Internet Calendar Subscription）リンクは、カレンダーデータを共有するための標準形式です。このリンクを通じて、Google、Apple、OutlookなどのカレンダーアプリでKATUSA Calendarを購読できます。",
    },
    {
      id: "compatibility",
      question: "どのカレンダーアプリと互換性がありますか？",
      answer:
        "KATUSA CalendarはGoogle Calendar、Apple Calendar、Microsoft Outlook、Mozilla Thunderbirdなど、ほとんどの主要なカレンダーアプリケーションと互換性があります。",
    },
    {
      id: "updates",
      question: "どのくらいの頻度で更新されますか？",
      answer:
        "KATUSA Calendarは定期的に更新されます。ほとんどのカレンダーアプリはICS購読を自動的に更新するため、常に最新のスケジュールを確認できます。",
    },
    {
      id: "free",
      question: "本当に無料ですか？",
      answer:
        "はい、KATUSA Calendarは完全に無料で提供されています。別途の登録や支払いは必要なく、すべての機能を制限なく利用できます。",
    },
    {
      id: "request",
      question: "私の部隊のカレンダーがありません。追加してもらえますか？",
      answer:
        "はい、継続的に新しい部隊カレンダーを追加しています。必要な部隊カレンダーがある場合は、GitHubのイシューを通じてリクエストしてください。",
    },
    {
      id: "error",
      question: "カレンダー情報が間違っています。どうすればいいですか？",
      answer:
        "カレンダー情報にエラーがあるか、更新が必要な場合は、GitHubリポジトリにイシューを登録していただければ、迅速に修正いたします。",
    },
  ],
  zh: [
    {
      id: "ics",
      question: "什么是ICS链接？",
      answer:
        "ICS（Internet Calendar Subscription）链接是共享日历数据的标准格式。通过此链接，您可以在Google、Apple、Outlook等日历应用中订阅KATUSA日历。",
    },
    {
      id: "compatibility",
      question: "与哪些日历应用兼容？",
      answer:
        "KATUSA日历与大多数主要日历应用兼容，包括Google Calendar、Apple Calendar、Microsoft Outlook、Mozilla Thunderbird等。",
    },
    {
      id: "updates",
      question: "更新频率如何？",
      answer: "KATUSA日历定期更新。大多数日历应用会自动更新ICS订阅，因此您始终可以查看最新日程。",
    },
    {
      id: "free",
      question: "真的免费吗？",
      answer: "是的，KATUSA日历完全免费提供。无需单独注册或付款，所有功能均可无限制使用。",
    },
    {
      id: "request",
      question: "没有我所在部队的日历。可以添加吗？",
      answer: "是的，我们不断添加新的部队日历。如果您需要特定部队的日历，请通过GitHub问题提出请求。",
    },
    {
      id: "error",
      question: "日历信息不正确。我该怎么办？",
      answer: "如果日历信息有错误或需要更新，请在GitHub存储库中注册问题，我们将快速修复。",
    },
  ],
}

// 언어에 따른 FAQ 데이터 가져오기
export const getFAQByLanguage = (language) => {
  return faqData[language] || faqData.ko
}
