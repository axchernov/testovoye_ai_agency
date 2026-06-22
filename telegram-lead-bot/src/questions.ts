import type { Question } from "./types.js";

export const questions: readonly Question[] = [
  { key: "companyName", type: "text", text: "Название компании" },
  {
    key: "website",
    type: "text",
    text: "Сайт компании",
    hint: "Можно отправить ссылку или написать «нет сайта».",
  },
  { key: "industry", type: "text", text: "Сфера деятельности" },
  {
    key: "employeeCount",
    type: "choice",
    text: "Сколько сотрудников?",
    options: ["1–10", "11–50", "51–200", "200+"],
  },
  {
    key: "annualRevenue",
    type: "choice",
    text: "Годовой оборот?",
    options: ["до 10 млн ₽", "10–50 млн ₽", "50–200 млн ₽", "200 млн+ ₽", "не раскрываю"],
  },
  {
    key: "supportPayroll",
    type: "text",
    text: "Сколько тратите в год на ФОТ поддержки/отдела?",
    hint: "Можно указать примерную вилку.",
  },
  { key: "painPoint", type: "text", text: "Какую задачу хотите решить / что болит?" },
  {
    key: "startTime",
    type: "choice",
    text: "Когда планируете начать?",
    options: ["уже сейчас", "в течение месяца", "1–3 месяца", "просто смотрю"],
  },
  {
    key: "budget",
    type: "choice",
    text: "Бюджет на проект?",
    options: ["до 100к ₽", "100–300к ₽", "300к–1 млн ₽", "1 млн+ ₽", "обсудим"],
  },
  { key: "contactName", type: "text", text: "Имя контактного лица" },
  { key: "phone", type: "text", text: "Телефон", validation: "phone" },
  { key: "email", type: "text", text: "Email", validation: "email" },
  {
    key: "otherContacts",
    type: "text",
    text: "Другие контакты Telegram / WhatsApp",
    hint: "Можно написать Telegram, WhatsApp или «нет».",
  },
];
