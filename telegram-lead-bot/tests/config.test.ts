import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { readConfig } from "../src/config.js";

describe("readConfig", () => {
  it("требует BOT_TOKEN", () => {
    assert.throws(() => readConfig({}), /BOT_TOKEN/);
  });

  it("читает токен и личный ADMIN_CHAT_ID", () => {
    assert.deepEqual(readConfig({ BOT_TOKEN: "token", ADMIN_CHAT_ID: "123456" }), {
      botToken: "token",
      adminChatId: 123456,
      proxyUrl: undefined,
    });
  });

  it("не падает при отсутствующем или некорректном ADMIN_CHAT_ID", () => {
    assert.deepEqual(readConfig({ BOT_TOKEN: "token" }), {
      botToken: "token",
      adminChatId: undefined,
      proxyUrl: undefined,
    });
    assert.deepEqual(readConfig({ BOT_TOKEN: "token", ADMIN_CHAT_ID: "abc" }), {
      botToken: "token",
      adminChatId: undefined,
      proxyUrl: undefined,
    });
  });

  it("читает HTTPS_PROXY для Telegram API", () => {
    assert.deepEqual(readConfig({ BOT_TOKEN: "token", HTTPS_PROXY: "http://127.0.0.1:8080" }), {
      botToken: "token",
      adminChatId: undefined,
      proxyUrl: "http://127.0.0.1:8080",
    });
  });
});
