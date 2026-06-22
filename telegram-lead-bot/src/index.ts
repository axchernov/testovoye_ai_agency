import "dotenv/config";

import { createBot } from "./bot.js";
import { readConfig } from "./config.js";

try {
  const { botToken, adminChatId, proxyUrl } = readConfig(process.env);
  if (adminChatId === undefined) {
    console.error("ADMIN_CHAT_ID не указан или имеет неверный формат. Заявки нельзя будет отправить администратору.");
  }

  if (proxyUrl) {
    console.log("Для Telegram API используется proxy из переменной окружения");
  }

  const bot = createBot(botToken, adminChatId, proxyUrl);
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));

  await bot.launch({}, () => {
    console.log("Telegram-бот подключён к Telegram API и запускает long polling");
  });
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
