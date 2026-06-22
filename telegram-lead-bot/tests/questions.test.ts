import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { questions } from "../src/questions.js";

describe("questions", () => {
  it("содержит 13 вопросов в порядке из ТЗ", () => {
    assert.equal(questions.length, 13);
    assert.deepEqual(
      questions.map(({ key, text }) => [key, text]),
      [
        ["companyName", "Название компании"],
        ["website", "Сайт компании"],
        ["industry", "Сфера деятельности"],
        ["employeeCount", "Сколько сотрудников?"],
        ["annualRevenue", "Годовой оборот?"],
        ["supportPayroll", "Сколько тратите в год на ФОТ поддержки/отдела?"],
        ["painPoint", "Какую задачу хотите решить / что болит?"],
        ["startTime", "Когда планируете начать?"],
        ["budget", "Бюджет на проект?"],
        ["contactName", "Имя контактного лица"],
        ["phone", "Телефон"],
        ["email", "Email"],
        ["otherContacts", "Другие контакты Telegram / WhatsApp"],
      ],
    );
  });

  it("задаёт вопросы 4, 5, 8 и 9 кнопками с точными вариантами", () => {
    const choiceQuestions = questions.filter((question) => question.type === "choice");

    assert.deepEqual(
      choiceQuestions.map(({ key, options }) => [key, options]),
      [
        ["employeeCount", ["1–10", "11–50", "51–200", "200+"]],
        ["annualRevenue", ["до 10 млн ₽", "10–50 млн ₽", "50–200 млн ₽", "200 млн+ ₽", "не раскрываю"]],
        ["startTime", ["уже сейчас", "в течение месяца", "1–3 месяца", "просто смотрю"]],
        ["budget", ["до 100к ₽", "100–300к ₽", "300к–1 млн ₽", "1 млн+ ₽", "обсудим"]],
      ],
    );
  });

  it("сохраняет подсказки и проверки текстовых вопросов", () => {
    assert.equal(questions[1]?.hint, "Можно отправить ссылку или написать «нет сайта».");
    assert.equal(questions[5]?.hint, "Можно указать примерную вилку.");
    assert.equal(questions[10]?.validation, "phone");
    assert.equal(questions[11]?.validation, "email");
    assert.equal(questions[12]?.hint, "Можно написать Telegram, WhatsApp или «нет».");
  });
});
