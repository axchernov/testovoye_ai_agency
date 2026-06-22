import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("Telegram bot URL has one source of truth", async () => {
  const content = await read("lib/site-content.ts");
  assert.match(content, /export const BOT_LINK = "https:\/\/t\.me\/testovy_bot_qualbot"/);
  assert.equal((content.match(/https:\/\/t\.me\/testovy_bot_qualbot/g) ?? []).length, 1);
});

test("content defines six services, five steps and six audiences", async () => {
  const content = await read("lib/site-content.ts");
  assert.equal((content.match(/id: "service-\d"/g) ?? []).length, 6);
  assert.equal((content.match(/id: "step-\d"/g) ?? []).length, 5);
  assert.equal((content.match(/id: "audience-\d"/g) ?? []).length, 6);
});

test("page exposes semantic navigation sections", async () => {
  const page = await read("app/page.tsx");
  for (const id of ["services", "process", "audiences", "scenario", "contact"]) {
    assert.match(page, new RegExp(`id=["']${id}["']`));
  }
  assert.match(page, /<header/);
  assert.match(page, /<main/);
  assert.match(page, /<footer/);
});

test("all conversion links use BOT_LINK through CtaLink", async () => {
  const cta = await read("components/CtaLink.tsx");
  assert.match(cta, /href=\{BOT_LINK\}/);
  assert.match(cta, /target="_blank"/);
  assert.match(cta, /rel="noreferrer"/);
});

test("styles include responsive and reduced-motion contracts", async () => {
  const css = await read("app/globals.css");
  assert.match(css, /--color-paper:\s*#f4f0e6/i);
  assert.match(css, /@media\s*\(max-width:\s*768px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-x:\s*clip/);
});

test("marquee text is centered within the orange ribbon", async () => {
  const css = await read("app/globals.css");
  const marqueeContent = css.match(/\.marquee div\s*\{(?<rules>[\s\S]*?)\}/)?.groups?.rules ?? "";

  assert.match(marqueeContent, /min-width:\s*100%/);
  assert.match(marqueeContent, /margin-inline:\s*auto/);
  assert.match(marqueeContent, /text-align:\s*center/);
  assert.match(marqueeContent, /left:\s*50%/);
  assert.match(marqueeContent, /transform:\s*translateX\(-50%\)/);
});

test("README documents setup, build and bot link replacement", async () => {
  const readme = await read("README.md");
  for (const command of ["npm install", "npm run dev", "npm run build"]) {
    assert.match(readme, new RegExp(command.replaceAll(" ", "\\s+")));
  }
  assert.match(readme, /lib\/site-content\.ts/);
  assert.match(readme, /BOT_LINK/);
});
