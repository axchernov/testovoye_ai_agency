import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { formatLead } from "../src/formatLead.js";
import type { LeadAnswers } from "../src/types.js";

const answers: LeadAnswers = {
  companyName: "Альфа",
  website: "https://example.ru",
  industry: "Логистика",
  employeeCount: "51–200",
  annualRevenue: "50–200 млн ₽",
  supportPayroll: "5 млн ₽",
  painPoint: "Автоматизировать обращения",
  startTime: "уже сейчас",
  budget: "300к–1 млн ₽",
  contactName: "Иван",
  phone: "+7 (999) 123-45-67",
  email: "ivan@example.ru",
  otherContacts: "@ivan",
};

describe("formatLead", () => {
  it("формирует полную заявку для администратора", () => {
    const result = formatLead(answers, { id: 42, username: "ivan", first_name: "Иван" });

    assert.equal(
      result,
      [
        "🆕 Новая заявка на AI-автоматизацию",
        "",
        "🏢 Компания: Альфа",
        "🌐 Сайт: https://example.ru",
        "📌 Сфера: Логистика",
        "👥 Сотрудников: 51–200",
        "💰 Оборот: 50–200 млн ₽",
        "👨‍💼 ФОТ поддержки/отдела: 5 млн ₽",
        "🔥 Боль / задача: Автоматизировать обращения",
        "🕒 Когда начать: уже сейчас",
        "💳 Бюджет: 300к–1 млн ₽",
        "",
        "👤 Контактное лицо: Иван",
        "📞 Телефон: +7 (999) 123-45-67",
        "✉️ Email: ivan@example.ru",
        "💬 Другие контакты: @ivan",
        "",
        "Telegram user:",
        "id: 42",
        "username: @ivan",
        "first_name: Иван",
      ].join("\n"),
    );
  });

  it("явно показывает отсутствующие Telegram-поля", () => {
    const result = formatLead(answers, { id: 42 });

    assert.match(result, /username: не указан/);
    assert.match(result, /first_name: не указано/);
  });
});
