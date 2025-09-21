import { Share2, Clock, SearchCheck, Users, Calendar, Check } from "lucide-react"

// 각 기능에 대한 데이터를 언어별로 정의
export const featuresData = {
  ko: [
    {
      id: "easy-subscribe",
      icon: Share2,
      title: "간편한 구독",
      description: "ICS 링크로 Google, Apple, Outlook 등 모든 캘린더 앱에서 쉽게 구독할 수 있습니다.",
    },
    {
      id: "auto-update",
      icon: Clock,
      title: "자동 업데이트",
      description: "일정이 변경되면 구독한 캘린더에 자동으로 반영됩니다.",
    },
    {
      id: "notifications",
      icon: SearchCheck,
      title: "간편한 확인",
      description: "주요 휴일을 스마트폰 앱에서 쉽게 확인할 수 있습니다.",
    },
    {
      id: "unit-specific",
      icon: Users,
      title: "카투사 맞춤 일정",
      description: "카투사를 위한 맞춤 일정을 제공합니다.",
    },
    {
      id: "holidays",
      icon: Calendar,
      title: "한국 공휴일 포함",
      description: "한국 공휴일과 미군 휴일을 모두 포함하여 휴가 계획을 쉽게 세울 수 있습니다.",
    },
    {
      id: "free",
      icon: Check,
      title: "완전 무료",
      description: "모든 기능을 무료로 제공합니다. 별도의 가입이나 결제가 필요 없습니다.",
    },
  ],
  en: [
    {
      id: "easy-subscribe",
      icon: Share2,
      title: "Easy Subscription",
      description: "Easily subscribe with ICS links in any calendar app like Google, Apple, Outlook, etc.",
    },
    {
      id: "auto-update",
      icon: Clock,
      title: "Automatic Updates",
      description: "When schedules change, they are automatically reflected in your subscribed calendar.",
    },
    {
      id: "notifications",
      icon: SearchCheck,
      title: "Easy Check",
      description: "Easily check major holidays in your smartphone app.",
    },
    {
      id: "unit-specific",
      icon: Users,
      title: "Built for KATUSA",
      description: "Provides customized schedules for KATUSA.",
    },
    {
      id: "holidays",
      icon: Calendar,
      title: "Korean Holidays Included",
      description: "Includes both Korean holidays and US military holidays to help you plan your leave.",
    },
    {
      id: "free",
      icon: Check,
      title: "Completely Free",
      description: "All features are provided for free. No registration or payment required.",
    },
  ],
  es: [
    {
      id: "easy-subscribe",
      icon: Share2,
      title: "Suscripción Fácil",
      description:
        "Suscríbete fácilmente con enlaces ICS en cualquier aplicación de calendario como Google, Apple, Outlook, etc.",
    },
    {
      id: "auto-update",
      icon: Clock,
      title: "Actualizaciones Automáticas",
      description: "Cuando cambian los horarios, se reflejan automáticamente en tu calendario suscrito.",
    },
    {
      id: "notifications",
      icon: SearchCheck,
      title: "Verificación Fácil",
      description: "Consulta fácilmente los días festivos principales en la aplicación de tu smartphone.",
    },
    {
      id: "unit-specific",
      icon: Users,
      title: "Diseñado para KATUSA",
      description: "Proporciona horarios personalizados para KATUSA.",
    },
    {
      id: "holidays",
      icon: Calendar,
      title: "Días Festivos Coreanos Incluidos",
      description:
        "Incluye tanto días festivos coreanos como días festivos militares de EE. UU. para ayudarte a planificar tus permisos.",
    },
    {
      id: "free",
      icon: Check,
      title: "Completamente Gratis",
      description: "Todas las funciones se ofrecen de forma gratuita. No se requiere registro ni pago.",
    },
  ],
}

// 언어에 따른 기능 데이터 가져오기
export const getFeaturesByLanguage = (language) => {
  return featuresData[language] || featuresData.ko || []
}
