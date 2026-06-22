import { Markup, Telegraf, type Context } from "telegraf";
import { message } from "telegraf/filters";
import { HttpsProxyAgent } from "https-proxy-agent";

import { formatLead } from "./formatLead.js";
import { questions } from "./questions.js";
import { clearSurvey, saveAnswer, startSurvey, userStates } from "./state.js";
import { validateEmail, validatePhone, validateText } from "./validation.js";

const WELCOME_TEXT = `Здравствуйте! Это бот предварительной квалификации заявок для AI-автоматизации бизнеса.

Ответьте на несколько вопросов — это поможет быстрее понять вашу задачу и предложить подходящее решение.`;

const CONSENT_TEXT = `Перед началом нужно согласие на обработку персональных данных.

В рамках заявки мы собираем контактные данные: имя, телефон, email и дополнительные контакты. Эти данные нужны только для обработки обращения и связи с вами по вашей задаче.`;

const SUCCESS_TEXT = "Спасибо! Заявка отправлена. Мы свяжемся с вами в ближайшее время.";
const DELIVERY_ERROR_TEXT = "Не удалось отправить заявку. Пожалуйста, попробуйте отправить последний ответ ещё раз позже.";

async function askCurrentQuestion(ctx: Context, userId: number): Promise<void> {
  const state = userStates.get(userId);
  if (!state) {
    await ctx.reply("Сначала нажмите /start, чтобы начать опрос.");
    return;
  }

  const question = questions[state.step];
  if (!question) {
    await ctx.reply("Опрос уже завершён. Чтобы начать заново, нажмите /start.");
    return;
  }

  if (question.type === "choice") {
    const buttons = question.options.map((option, optionIndex) =>
      Markup.button.callback(option, `answer:${state.step}:${optionIndex}`),
    );
    await ctx.reply(question.text, Markup.inlineKeyboard(buttons, { columns: 2 }));
    return;
  }

  const text = question.hint ? `${question.text}\n\n${question.hint}` : question.text;
  await ctx.reply(text);
}

async function deliverLead(ctx: Context, userId: number, adminChatId: number | undefined): Promise<void> {
  const state = userStates.get(userId);
  if (!state || !ctx.from) {
    return;
  }

  if (adminChatId === undefined) {
    console.error("ADMIN_CHAT_ID не указан или имеет неверный формат");
    state.step = questions.length - 1;
    await ctx.reply(DELIVERY_ERROR_TEXT);
    return;
  }

  try {
    await ctx.telegram.sendMessage(adminChatId, formatLead(state.answers, ctx.from));
    clearSurvey(userId);
    await ctx.reply(SUCCESS_TEXT);
  } catch (error) {
    console.error("Не удалось отправить заявку администратору:", error);
    state.step = questions.length - 1;
    await ctx.reply(DELIVERY_ERROR_TEXT);
  }
}

export function createBot(
  botToken: string,
  adminChatId: number | undefined,
  proxyUrl?: string,
): Telegraf<Context> {
  const bot = new Telegraf(
    botToken,
    proxyUrl ? { telegram: { agent: new HttpsProxyAgent(proxyUrl) } } : undefined,
  );

  bot.start(async (ctx) => {
    clearSurvey(ctx.from.id);
    await ctx.reply(WELCOME_TEXT);
    await ctx.reply(
      CONSENT_TEXT,
      Markup.inlineKeyboard([
        Markup.button.callback("Согласен", "consent:yes"),
        Markup.button.callback("Не согласен", "consent:no"),
      ]),
    );
  });

  bot.command("reset", async (ctx) => {
    clearSurvey(ctx.from.id);
    await ctx.reply("Текущий прогресс сброшен. Нажмите /start, чтобы начать заново.");
  });

  bot.action("consent:yes", async (ctx) => {
    await ctx.answerCbQuery();
    startSurvey(ctx.from.id);
    await ctx.reply("Спасибо за согласие. Начинаем опрос.");
    await askCurrentQuestion(ctx, ctx.from.id);
  });

  bot.action("consent:no", async (ctx) => {
    await ctx.answerCbQuery();
    clearSurvey(ctx.from.id);
    await ctx.reply("Без согласия на обработку персональных данных заявка не может быть принята.");
  });

  bot.action(/^answer:(\d+):(\d+)$/, async (ctx) => {
    await ctx.answerCbQuery();
    const state = userStates.get(ctx.from.id);
    const questionIndex = Number(ctx.match[1]);
    const optionIndex = Number(ctx.match[2]);
    const question = questions[questionIndex];

    if (!state) {
      await ctx.reply("Сначала нажмите /start, чтобы начать опрос.");
      return;
    }

    if (state.step !== questionIndex || question?.type !== "choice") {
      await ctx.reply("Эта кнопка больше не актуальна. Ответьте на текущий вопрос.");
      await askCurrentQuestion(ctx, ctx.from.id);
      return;
    }

    const answer = question.options[optionIndex];
    if (!answer) {
      await ctx.reply("Выберите один из предложенных вариантов кнопкой.");
      return;
    }

    saveAnswer(ctx.from.id, question.key, answer);
    await askCurrentQuestion(ctx, ctx.from.id);
  });

  bot.on(message("text"), async (ctx) => {
    const state = userStates.get(ctx.from.id);
    if (!state) {
      await ctx.reply("Сначала нажмите /start, чтобы начать опрос.");
      return;
    }

    const question = questions[state.step];
    if (!question) {
      await ctx.reply("Опрос уже завершён. Чтобы начать заново, нажмите /start.");
      return;
    }

    if (question.type === "choice") {
      await ctx.reply("Пожалуйста, выберите вариант кнопкой под текущим вопросом.");
      return;
    }

    const textResult = validateText(ctx.message.text);
    if (!textResult.ok) {
      await ctx.reply("Ответ не должен быть пустым. Пожалуйста, введите значение.");
      return;
    }

    if (question.validation === "phone" && !validatePhone(textResult.value)) {
      await ctx.reply("Введите корректный телефон: от 10 до 15 цифр, можно использовать +, пробелы, скобки и дефисы.");
      return;
    }

    if (question.validation === "email" && !validateEmail(textResult.value)) {
      await ctx.reply("Введите корректный email, например name@example.ru.");
      return;
    }

    saveAnswer(ctx.from.id, question.key, textResult.value);
    if (state.step === questions.length) {
      await deliverLead(ctx, ctx.from.id, adminChatId);
      return;
    }

    await askCurrentQuestion(ctx, ctx.from.id);
  });

  bot.catch((error, ctx) => {
    console.error(`Ошибка при обработке обновления ${ctx.update.update_id}:`, error);
  });

  return bot;
}
