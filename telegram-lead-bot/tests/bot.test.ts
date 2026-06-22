import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";

import { createBot } from "../src/bot.js";
import { questions } from "../src/questions.js";
import { userStates } from "../src/state.js";

type ApiCall = { method: string; payload: Record<string, unknown> };

const user = { id: 42, is_bot: false, first_name: "Иван", username: "ivan" };
const chat = { id: 42, type: "private" as const };

function createHarness(adminChatId: number | undefined = 777) {
  const bot = createBot("test-token", adminChatId);
  const calls: ApiCall[] = [];
  let updateId = 1;

  bot.botInfo = { id: 999, is_bot: true, first_name: "Test", username: "test_bot" };
  Object.getPrototypeOf(bot.telegram).callApi = async (method: string, payload: Record<string, unknown>) => {
    calls.push({ method, payload });
    return { message_id: calls.length, date: 0, chat, text: payload.text } as never;
  };

  const sendText = async (text: string, command = false) => {
    await bot.handleUpdate({
      update_id: updateId++,
      message: {
        message_id: updateId,
        date: 0,
        chat,
        from: user,
        text,
        ...(command ? { entities: [{ type: "bot_command" as const, offset: 0, length: text.length }] } : {}),
      },
    });
  };

  const press = async (data: string) => {
    await bot.handleUpdate({
      update_id: updateId++,
      callback_query: {
        id: String(updateId),
        chat_instance: "test",
        from: user,
        data,
        message: { message_id: updateId, date: 0, chat, text: "Кнопки" },
      },
    });
  };

  return { calls, press, sendText };
}

describe("telegram flow", () => {
  beforeEach(() => userStates.clear());

  it("не начинает опрос без согласия", async () => {
    const { calls, sendText } = createHarness();

    await sendText("/start", true);
    await sendText("ООО Альфа");

    assert.equal(userStates.has(user.id), false);
    assert.match(String(calls.at(-1)?.payload.text), /нажмите \/start/i);
  });

  it("просит использовать кнопку на вопросе с вариантами", async () => {
    const { calls, press, sendText } = createHarness();
    await sendText("/start", true);
    await press("consent:yes");
    await sendText("Альфа");
    await sendText("нет сайта");
    await sendText("Логистика");

    await sendText("51–200");

    assert.match(String(calls.at(-1)?.payload.text), /выберите вариант кнопкой/i);
    assert.equal(userStates.get(user.id)?.step, 3);
  });

  it("валидирует контакты и отправляет готовую заявку лично администратору", async () => {
    const { calls, press, sendText } = createHarness(777);
    await sendText("/start", true);
    await press("consent:yes");

    const textAnswers = new Map([
      [0, "Альфа"],
      [1, "https://example.ru"],
      [2, "Логистика"],
      [5, "5 млн ₽"],
      [6, "Автоматизировать обращения"],
      [9, "Иван"],
      [10, "+7 (999) 123-45-67"],
      [11, "ivan@example.ru"],
      [12, "@ivan"],
    ]);

    for (let index = 0; index < questions.length; index += 1) {
      const question = questions[index]!;
      if (question.type === "choice") {
        await press(`answer:${index}:0`);
      } else {
        await sendText(textAnswers.get(index)!);
      }
    }

    const adminCall = calls.find((call) => call.method === "sendMessage" && call.payload.chat_id === 777);
    assert.ok(adminCall);
    assert.match(String(adminCall.payload.text), /🆕 Новая заявка/);
    assert.match(String(adminCall.payload.text), /📞 Телефон: \+7 \(999\) 123-45-67/);
    assert.equal(userStates.has(user.id), false);
    assert.equal(
      calls.some((call) => String(call.payload.text).includes("Спасибо! Заявка отправлена.")),
      true,
    );
  });
});
