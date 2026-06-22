export interface BotConfig {
  botToken: string;
  adminChatId: number | undefined;
  proxyUrl: string | undefined;
}

export function readConfig(env: Record<string, string | undefined>): BotConfig {
  const botToken = env.BOT_TOKEN?.trim();
  if (!botToken) {
    throw new Error("Переменная окружения BOT_TOKEN не указана");
  }

  const rawAdminChatId = env.ADMIN_CHAT_ID?.trim();
  const parsedAdminChatId = rawAdminChatId && /^-?\d+$/.test(rawAdminChatId) ? Number(rawAdminChatId) : undefined;
  const adminChatId = Number.isSafeInteger(parsedAdminChatId) ? parsedAdminChatId : undefined;
  const proxyUrl = env.HTTPS_PROXY?.trim() || env.HTTP_PROXY?.trim() || undefined;

  return { botToken, adminChatId, proxyUrl };
}
