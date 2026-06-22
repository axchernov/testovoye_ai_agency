import type { AnswerKey, LeadAnswers, TelegramUser } from "./types.js";

export function formatLead(answers: LeadAnswers, user: TelegramUser): string {
  const value = (key: AnswerKey): string => answers[key] ?? "не указано";

  return [
    "🆕 Новая заявка на AI-автоматизацию",
    "",
    `🏢 Компания: ${value("companyName")}`,
    `🌐 Сайт: ${value("website")}`,
    `📌 Сфера: ${value("industry")}`,
    `👥 Сотрудников: ${value("employeeCount")}`,
    `💰 Оборот: ${value("annualRevenue")}`,
    `👨‍💼 ФОТ поддержки/отдела: ${value("supportPayroll")}`,
    `🔥 Боль / задача: ${value("painPoint")}`,
    `🕒 Когда начать: ${value("startTime")}`,
    `💳 Бюджет: ${value("budget")}`,
    "",
    `👤 Контактное лицо: ${value("contactName")}`,
    `📞 Телефон: ${value("phone")}`,
    `✉️ Email: ${value("email")}`,
    `💬 Другие контакты: ${value("otherContacts")}`,
    "",
    "Telegram user:",
    `id: ${user.id}`,
    `username: ${user.username ? `@${user.username}` : "не указан"}`,
    `first_name: ${user.first_name ?? "не указано"}`,
  ].join("\n");
}
