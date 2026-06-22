export const BOT_LINK = "https://t.me/testovy_bot_qualbot";

export const services = [
  {
    id: "service-1",
    number: "01",
    title: "Квалификация лидов",
    description: "Бот задаёт вопросы, собирает данные и передаёт готовую заявку менеджеру.",
    tag: "LEADS",
  },
  {
    id: "service-2",
    number: "02",
    title: "Telegram-боты",
    description: "Опросники, заявки, уведомления, поддержка и внутренние сценарии.",
    tag: "BOTS",
  },
  {
    id: "service-3",
    number: "03",
    title: "AI-агенты",
    description: "Ассистенты, которые работают с текстами, таблицами, базой знаний и процессами.",
    tag: "AGENTS",
  },
  {
    id: "service-4",
    number: "04",
    title: "CRM-интеграции",
    description: "Передача заявок, статусов и комментариев в Bitrix24, amoCRM и другие системы.",
    tag: "SYNC",
  },
  {
    id: "service-5",
    number: "05",
    title: "Поддержка клиентов",
    description: "Ответы на частые вопросы и передача сложных диалогов человеку.",
    tag: "SUPPORT",
  },
  {
    id: "service-6",
    number: "06",
    title: "Внутренние ассистенты",
    description: "Помощники для сотрудников: инструкции, регламенты и поиск по базе знаний.",
    tag: "TEAM",
  },
] as const;

export const processSteps = [
  { id: "step-1", number: "01", title: "Разбираем процесс" },
  { id: "step-2", number: "02", title: "Находим ручную рутину" },
  { id: "step-3", number: "03", title: "Проектируем сценарий" },
  { id: "step-4", number: "04", title: "Собираем MVP" },
  { id: "step-5", number: "05", title: "Тестируем и улучшаем" },
] as const;

export const audiences = [
  { id: "audience-1", label: "Владельцам бизнеса" },
  { id: "audience-2", label: "Отделам продаж" },
  { id: "audience-3", label: "Поддержке" },
  { id: "audience-4", label: "Онлайн-школам" },
  { id: "audience-5", label: "Агентствам" },
  { id: "audience-6", label: "Сервисным компаниям" },
] as const;
