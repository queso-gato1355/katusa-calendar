// 다국어 텍스트 데이터
export const translations = {
  // 히어로 섹션
  hero: {
    ko: {
      title: "카투사를 위한\n맞춤형 캘린더",
      description: "KATUSA 복무 중 필요한 모든 일정을 한 눈에 확인하세요. 훈련, 휴가, 중요 행사를 놓치지 마세요.",
      subscribeButton: "캘린더 구독하기",
      howToUseButton: "사용 방법",
    },
    en: {
      title: "Custom Calendar\nfor KATUSA",
      description:
        "Check all the schedules you need during your KATUSA service at a glance. Don't miss training, vacations, and important events.",
      subscribeButton: "Subscribe to Calendar",
      howToUseButton: "How to Use",
    },
    ja: {
      title: "KATUSAのための\nカスタムカレンダー",
      description:
        "KATUSA勤務中に必要なすべての日程を一目で確認できます。訓練、休暇、重要な行事を見逃さないでください。",
      subscribeButton: "カレンダーを購読する",
      howToUseButton: "使用方法",
    },
    zh: {
      title: "为KATUSA定制的\n日历",
      description: "一目了然地查看KATUSA服役期间所需的所有日程。不要错过训练、假期和重要活动。",
      subscribeButton: "订阅日历",
      howToUseButton: "使用方法",
    },
  },

  // 기능 섹션
  features: {
    ko: {
      badge: "주요 기능",
      title: "KATUSA Calendar의 장점",
      description: "카투사 복무 중 필요한 모든 일정을 효율적으로 관리하세요.",
    },
    en: {
      badge: "Key Features",
      title: "Benefits of KATUSA Calendar",
      description: "Efficiently manage all schedules needed during your KATUSA service.",
    },
    ja: {
      badge: "主な機能",
      title: "KATUSA Calendarの利点",
      description: "KATUSA勤務中に必要なすべての日程を効率的に管理しましょう。",
    },
    zh: {
      badge: "主要功能",
      title: "KATUSA日历的优势",
      description: "高效管理KATUSA服役期间所需的所有日程。",
    },
  },

  // 사용 방법 섹션
  howItWorks: {
    ko: {
      title: "사용 방법",
      description: "KATUSA Calendar를 구독하는 간단한 3단계 과정을 알아보세요.",
      steps: [
        {
          title: "캘린더 선택",
          description: "소속 부대나 필요한 캘린더를 선택하세요.",
        },
        {
          title: "ICS 링크 복사",
          description: "선택한 캘린더의 ICS 링크를 복사하세요.",
        },
        {
          title: "캘린더 앱에 추가",
          description: "복사한 링크를 Google, Apple, Outlook 등의 캘린더 앱에 추가하세요.",
        },
      ],
    },
    en: {
      title: "How It Works",
      description: "Learn about the simple 3-step process to subscribe to KATUSA Calendar.",
      steps: [
        {
          title: "Select Calendar",
          description: "Choose the calendar for your unit or the one you need.",
        },
        {
          title: "Copy ICS Link",
          description: "Copy the ICS link of the selected calendar.",
        },
        {
          title: "Add to Calendar App",
          description: "Add the copied link to calendar apps like Google, Apple, Outlook, etc.",
        },
      ],
    },
    ja: {
      title: "使用方法",
      description: "KATUSA Calendarを購読する簡単な3ステップのプロセスを確認してください。",
      steps: [
        {
          title: "カレンダーを選択",
          description: "所属部隊や必要なカレンダーを選択してください。",
        },
        {
          title: "ICSリンクをコピー",
          description: "選択したカレンダーのICSリンクをコピーしてください。",
        },
        {
          title: "カレンダーアプリに追加",
          description: "コピーしたリンクをGoogle、Apple、Outlookなどのカレンダーアプリに追加してください。",
        },
      ],
    },
    zh: {
      title: "使用方法",
      description: "了解订阅KATUSA日历的简单三步流程。",
      steps: [
        {
          title: "选择日历",
          description: "选择您所属部队或需要的日历。",
        },
        {
          title: "复制ICS链接",
          description: "复制所选日历的ICS链接。",
        },
        {
          title: "添加到日历应用",
          description: "将复制的链接添加到Google、Apple、Outlook等日历应用中。",
        },
      ],
    },
  },

  // 캘린더 섹션
  calendars: {
    ko: {
      title: "구독 가능한 캘린더",
      description: "필요한 캘린더를 선택하고 ICS 링크를 복사하여 구독하세요.",
      copyButton: "ICS 링크 복사하기",
      maintenanceButton: "점검 중",
      inquiryTitle: "원하는 달력 종류가 있나요?",
      inquiryDescription: "필요한 캘린더 종류가 없다면 문의해주세요. 추가해드리겠습니다.",
      inquiryButton: "문의하기",
    },
    en: {
      title: "Available Calendars",
      description: "Select the calendar you need, copy the ICS link, and subscribe.",
      copyButton: "Copy ICS Link",
      maintenanceButton: "Under Maintenance",
      inquiryTitle: "Looking for a specific calendar?",
      inquiryDescription: "If you don't see the calendar you need, please contact us. We'll add it for you.",
      inquiryButton: "Contact Us",
    },
    ja: {
      title: "購読可能なカレンダー",
      description: "必要なカレンダーを選択し、ICSリンクをコピーして購読してください。",
      copyButton: "ICSリンクをコピー",
      maintenanceButton: "メンテナンス中",
      inquiryTitle: "希望のカレンダーの種類がありますか？",
      inquiryDescription: "必要なカレンダーの種類がない場合は、お問い合わせください。追加いたします。",
      inquiryButton: "お問い合わせ",
    },
    zh: {
      title: "可订阅的日历",
      description: "选择您需要的日历，复制ICS链接并订阅。",
      copyButton: "复制ICS链接",
      maintenanceButton: "维护中",
      inquiryTitle: "需要其他类型的日历吗？",
      inquiryDescription: "如果没有您需要的日历类型，请联系我们。我们会为您添加。",
      inquiryButton: "联系我们",
    },
  },

  // FAQ 섹션
  faq: {
    ko: {
      title: "자주 묻는 질문",
      description: "KATUSA Calendar에 대해 가장 많이 묻는 질문들에 대한 답변입니다.",
    },
    en: {
      title: "Frequently Asked Questions",
      description: "Answers to the most common questions about KATUSA Calendar.",
    },
    ja: {
      title: "よくある質問",
      description: "KATUSA Calendarについてよく寄せられる質問への回答です。",
    },
    zh: {
      title: "常见问题",
      description: "关于KATUSA日历的常见问题解答。",
    },
  },

  // 푸터
  footer: {
    ko: {
      copyright: "오픈소스 프로젝트.",
      github: "GitHub",
    },
    en: {
      copyright: "Open Source Project.",
      github: "GitHub",
    },
    ja: {
      copyright: "オープンソースプロジェクト。",
      github: "GitHub",
    },
    zh: {
      copyright: "开源项目。",
      github: "GitHub",
    },
  },

  // 문의 페이지
  contact: {
    ko: {
      title: "문의하기",
      description: "질문이나 제안이 있으시면 아래 양식을 작성해 주세요.",
      nameLabel: "이름",
      namePlaceholder: "이름을 입력하세요",
      emailLabel: "이메일",
      emailPlaceholder: "답변을 받을 이메일 주소를 입력하세요",
      subjectLabel: "제목",
      subjectPlaceholder: "문의 제목을 입력하세요",
      typeLabel: "문의 종류",
      types: {
        general: "일반 문의",
        calendar: "캘린더 추가 요청",
        bug: "오류 신고",
        feature: "기능 제안",
        other: "기타",
      },
      messageLabel: "문의 내용",
      messagePlaceholder: "문의 내용을 자세히 입력해 주세요",
      submitButton: "제출하기",
      successMessage: "문의가 성공적으로 제출되었습니다. 빠른 시일 내에 답변 드리겠습니다.",
      errorMessage: "문의 제출 중 오류가 발생했습니다. 다시 시도해 주세요.",
    },
    en: {
      title: "Contact Us",
      description: "If you have any questions or suggestions, please fill out the form below.",
      nameLabel: "Name",
      namePlaceholder: "Enter your name",
      emailLabel: "Email",
      emailPlaceholder: "Enter your email address to receive a response",
      subjectLabel: "Subject",
      subjectPlaceholder: "Enter the subject of your inquiry",
      typeLabel: "Inquiry Type",
      types: {
        general: "General Inquiry",
        calendar: "Calendar Addition Request",
        bug: "Bug Report",
        feature: "Feature Suggestion",
        other: "Other",
      },
      messageLabel: "Message",
      messagePlaceholder: "Please provide details about your inquiry",
      submitButton: "Submit",
      successMessage: "Your inquiry has been successfully submitted. We will respond as soon as possible.",
      errorMessage: "An error occurred while submitting your inquiry. Please try again.",
    },
    ja: {
      title: "お問い合わせ",
      description: "ご質問やご提案がございましたら、以下のフォームにご記入ください。",
      nameLabel: "お名前",
      namePlaceholder: "お名前を入力してください",
      emailLabel: "メールアドレス",
      emailPlaceholder: "返信を受け取るメールアドレスを入力してください",
      subjectLabel: "件名",
      subjectPlaceholder: "お問い合わせの件名を入力してください",
      typeLabel: "お問い合わせの種類",
      types: {
        general: "一般的なお問い合わせ",
        calendar: "カレンダー追加リクエスト",
        bug: "バグ報告",
        feature: "機能提案",
        other: "その他",
      },
      messageLabel: "メッセージ",
      messagePlaceholder: "お問い合わせの詳細を入力してください",
      submitButton: "送信",
      successMessage: "お問い合わせが正常に送信されました。できるだけ早くご返信いたします。",
      errorMessage: "お問い合わせの送信中にエラーが発生しました。もう一度お試しください。",
    },
    zh: {
      title: "联系我们",
      description: "如果您有任何问题或建议，请填写下面的表格。",
      nameLabel: "姓名",
      namePlaceholder: "请输入您的姓名",
      emailLabel: "电子邮箱",
      emailPlaceholder: "请输入接收回复的电子邮箱地址",
      subjectLabel: "主题",
      subjectPlaceholder: "请输入您的咨询主题",
      typeLabel: "咨询类型",
      types: {
        general: "一般咨询",
        calendar: "日历添加请求",
        bug: "错误报告",
        feature: "功能建议",
        other: "其他",
      },
      messageLabel: "内容",
      messagePlaceholder: "请详细描述您的咨询内容",
      submitButton: "提交",
      successMessage: "您的咨询已成功提交。我们将尽快回复您。",
      errorMessage: "提交咨询时发生错误。请重试。",
    },
  },
}

// 특정 섹션과 언어에 대한 번역 텍스트 가져오기
export const getTranslation = (section, language) => {
  if (!translations[section]) return {}
  return translations[section][language] || translations[section]["ko"]
}
