import "dotenv/config";

import { createBot } from "./bot.js";
import { readConfig } from "./config.js";

try {
  const { botToken, adminChatId } = readConfig(process.env);
  if (adminChatId === undefined) {
    console.error("ADMIN_CHAT_ID не указан или имеет неверный формат. Заявки нельзя будет отправить администратору.");
  }

  const bot = createBot(botToken, adminChatId);
  await bot.launch();
  console.log("Telegram-бот запущен в режиме long polling");

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
