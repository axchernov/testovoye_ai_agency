# AI Automation Agency Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать автономный адаптивный Next.js-лендинг AI-агентства, все CTA которого ведут в `https://t.me/testovy_bot_qualbot`.

**Architecture:** Новый проект живёт только в `landing-ai-agency/` и использует Next.js App Router с TypeScript. Контент и единственная константа Telegram-ссылки отделены от презентационных React-компонентов; визуальная система реализована глобальным CSS без изображений, Tailwind и UI-библиотек.

**Tech Stack:** Next.js 15, React 19, TypeScript, CSS, ESLint, встроенный `node:test` для структурных проверок.

---

## Карта файлов

- `landing-ai-agency/package.json` — команды и зависимости автономного проекта.
- `landing-ai-agency/package-lock.json` — зафиксированные версии зависимостей.
- `landing-ai-agency/tsconfig.json` — строгая конфигурация TypeScript.
- `landing-ai-agency/next-env.d.ts` — типы Next.js.
- `landing-ai-agency/next.config.mjs` — конфигурация Next.js.
- `landing-ai-agency/eslint.config.mjs` — правила Next.js и TypeScript.
- `landing-ai-agency/app/layout.tsx` — метаданные, язык и корневой layout.
- `landing-ai-agency/app/page.tsx` — композиция семантических секций лендинга.
- `landing-ai-agency/app/globals.css` — дизайн-система, responsive-стили и движение.
- `landing-ai-agency/components/CtaLink.tsx` — единый внешний CTA Telegram.
- `landing-ai-agency/components/SectionHeading.tsx` — заголовок секции с индексом.
- `landing-ai-agency/components/TerminalCard.tsx` — hero-терминал и CSS-стикеры.
- `landing-ai-agency/components/ArrowIcon.tsx` — единая SVG-стрелка CTA.
- `landing-ai-agency/lib/site-content.ts` — `BOT_LINK` и массивы контента.
- `landing-ai-agency/tests/site-structure.test.mjs` — проверки ссылки, секций и документации без дополнительных библиотек.
- `landing-ai-agency/README.md` — установка, запуск, сборка и замена ссылки.

### Task 1: Создать автономный Next.js-каркас

**Files:**
- Create: `landing-ai-agency/package.json`
- Create: `landing-ai-agency/tsconfig.json`
- Create: `landing-ai-agency/next-env.d.ts`
- Create: `landing-ai-agency/next.config.mjs`
- Create: `landing-ai-agency/eslint.config.mjs`
- Create: `landing-ai-agency/app/layout.tsx`

- [ ] **Step 1: Создать package.json с командами проверки**

```json
{
  "name": "landing-ai-agency",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test": "node --test tests/*.test.mjs"
  },
  "dependencies": {
    "next": "15.5.7",
    "react": "19.1.1",
    "react-dom": "19.1.1"
  },
  "devDependencies": {
    "@eslint/eslintrc": "^3.3.1",
    "@types/node": "^22.18.0",
    "@types/react": "^19.1.0",
    "@types/react-dom": "^19.1.0",
    "eslint": "^9.35.0",
    "eslint-config-next": "15.5.7",
    "typescript": "^5.9.2"
  }
}
```

- [ ] **Step 2: Добавить строгую конфигурацию проекта**

`tsconfig.json` включает `strict: true`, `noEmit: true`, `moduleResolution: "bundler"`, `jsx: "preserve"`, Next.js plugin и alias `@/*`. `next.config.mjs` экспортирует пустой объект конфигурации. `next-env.d.ts` подключает `next` и `next/image-types/global`. `eslint.config.mjs` использует `FlatCompat` с `next/core-web-vitals` и `next/typescript`.

- [ ] **Step 3: Создать корневой layout**

```tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Automation — боты и AI-агенты для бизнеса",
  description: "Telegram-боты, AI-агенты и автоматизации, которые убирают ручную рутину.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 4: Установить зависимости**

Run: `cd landing-ai-agency; npm install`

Expected: создан `package-lock.json`, установка завершается с кодом 0.

- [ ] **Step 5: Проверить границы изменений и закоммитить каркас**

Run: `git status --short`

Expected: новые файлы находятся только в `landing-ai-agency/`.

```bash
git add landing-ai-agency/package.json landing-ai-agency/package-lock.json landing-ai-agency/tsconfig.json landing-ai-agency/next-env.d.ts landing-ai-agency/next.config.mjs landing-ai-agency/eslint.config.mjs landing-ai-agency/app/layout.tsx
git commit -m "chore: scaffold AI agency landing"
```

### Task 2: Зафиксировать контракт контента тестом

**Files:**
- Create: `landing-ai-agency/tests/site-structure.test.mjs`
- Create: `landing-ai-agency/lib/site-content.ts`

- [ ] **Step 1: Написать падающие структурные проверки**

```js
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
  assert.match(content, /export const services = \[/);
  assert.match(content, /export const processSteps = \[/);
  assert.match(content, /export const audiences = \[/);
  assert.equal((content.match(/service-\d/g) ?? []).length, 6);
  assert.equal((content.match(/step-\d/g) ?? []).length, 5);
  assert.equal((content.match(/audience-\d/g) ?? []).length, 6);
});
```

- [ ] **Step 2: Запустить тест и подтвердить ожидаемое падение**

Run: `cd landing-ai-agency; npm test`

Expected: FAIL с `ENOENT` для `lib/site-content.ts`.

- [ ] **Step 3: Добавить единую ссылку и типизированный контент**

Создать `site-content.ts` с `BOT_LINK`, шестью объектами `services` (`id`, `number`, `title`, `description`, `tag`), пятью объектами `processSteps` (`id`, `title`) и шестью объектами `audiences` (`id`, `label`). Использовать точные тексты из утверждённой спецификации и исходного ТЗ; идентификаторы имеют формы `service-1…6`, `step-1…5`, `audience-1…6`.

- [ ] **Step 4: Запустить тест и подтвердить прохождение**

Run: `cd landing-ai-agency; npm test`

Expected: 2 tests, 2 pass, 0 fail.

- [ ] **Step 5: Закоммитить контракт контента**

```bash
git add landing-ai-agency/lib/site-content.ts landing-ai-agency/tests/site-structure.test.mjs
git commit -m "test: define landing content contract"
```

### Task 3: Реализовать компоненты и семантическую страницу

**Files:**
- Create: `landing-ai-agency/components/ArrowIcon.tsx`
- Create: `landing-ai-agency/components/CtaLink.tsx`
- Create: `landing-ai-agency/components/SectionHeading.tsx`
- Create: `landing-ai-agency/components/TerminalCard.tsx`
- Create: `landing-ai-agency/app/page.tsx`
- Modify: `landing-ai-agency/tests/site-structure.test.mjs`

- [ ] **Step 1: Расширить тест контрактом страницы**

```js
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
```

- [ ] **Step 2: Запустить тест и подтвердить падение на отсутствующих файлах**

Run: `cd landing-ai-agency; npm test`

Expected: первые 2 теста проходят, новые тесты падают с `ENOENT`.

- [ ] **Step 3: Реализовать базовые компоненты**

`ArrowIcon` возвращает доступный декоративный SVG с `aria-hidden="true"`. `CtaLink` принимает `children` и необязательный `className`, всегда импортирует `BOT_LINK` и формирует `<a href={BOT_LINK} target="_blank" rel="noreferrer">`. `SectionHeading` принимает `eyebrow`, `title` и необязательный `description`. `TerminalCard` выводит три псевдокоманды и четыре CSS-стикера без растровых изображений.

- [ ] **Step 4: Собрать семантическую страницу**

`page.tsx` содержит:

- `header` с логотипом, якорями `#services`, `#process`, `#audiences` и `CtaLink`;
- `main` с hero, `services`, `process`, `audiences`, `scenario` и финальным `contact`;
- service-карточки через `services.map`;
- цепочку шагов через `processSteps.map`;
- ярлыки аудиторий через `audiences.map`;
- сценарий из пяти узлов с текстовыми стрелками, скрытыми от screen reader;
- `footer` с названием и текущим годом без клиентского состояния.

Весь русский текст берётся из ТЗ, а конверсионные ссылки создаются только через `CtaLink`.

- [ ] **Step 5: Запустить структурные тесты**

Run: `cd landing-ai-agency; npm test`

Expected: 4 tests, 4 pass, 0 fail.

- [ ] **Step 6: Закоммитить страницу**

```bash
git add landing-ai-agency/app/page.tsx landing-ai-agency/components landing-ai-agency/tests/site-structure.test.mjs
git commit -m "feat: build AI agency landing content"
```

### Task 4: Реализовать editorial creator/dev дизайн

**Files:**
- Create: `landing-ai-agency/app/globals.css`

- [ ] **Step 1: Добавить падающий тест дизайн-контрактов**

```js
test("styles include responsive and reduced-motion contracts", async () => {
  const css = await read("app/globals.css");
  assert.match(css, /--color-paper:\s*#f4f0e6/i);
  assert.match(css, /@media\s*\(max-width:\s*768px\)/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /overflow-x:\s*clip/);
});
```

- [ ] **Step 2: Запустить тест и подтвердить падение**

Run: `cd landing-ai-agency; npm test`

Expected: новый тест падает с `ENOENT` для `app/globals.css`.

- [ ] **Step 3: Добавить базовую дизайн-систему**

Определить в `:root` цвета `--color-paper`, `--color-ink`, `--color-muted`, `--color-rust`, `--color-dark-paper`, размеры контейнера, радиусы, тени и шрифтовые стеки. Добавить reset, `scroll-behavior: smooth`, выразительный `:focus-visible`, доступные размеры текста и `overflow-x: clip` на `body`.

- [ ] **Step 4: Оформить hero и terminal collage**

Hero использует асимметричную двухколоночную grid-композицию, заголовок через `clamp()`, грубое CSS-подчёркивание, тёмный терминал с заголовком окна, оранжевый starburst через `clip-path: polygon(...)` и повёрнутые стикеры с плотными границами. Начальное появление объединяется в одну короткую последовательность без JS.

- [ ] **Step 5: Оформить контентные секции**

Карточки услуг получают разные grid-span и акцентные вариации; процесс выглядит ступенчатой цепочкой с номерами; аудитории — как крупные наклонённые ярлыки; сценарий — как контрастная схема; финальный CTA — как большой тёмный постерный блок. Hover меняет цвет, тень или смещение декоративного слоя, не меняя размеры элементов.

- [ ] **Step 6: Добавить responsive и reduced-motion правила**

На `1024px` hero и сетки уплотняются. На `768px` навигационные якоря скрываются, hero становится одноколоночным, service-grid — одной колонкой, процесс и сценарий — вертикальными. На `390px` сохраняются внутренние поля не менее 18 px, CTA занимает доступную ширину, декоративные элементы не выходят за viewport. В `prefers-reduced-motion: reduce` отключаются animation и smooth scrolling.

- [ ] **Step 7: Запустить тесты**

Run: `cd landing-ai-agency; npm test`

Expected: 5 tests, 5 pass, 0 fail.

- [ ] **Step 8: Закоммитить визуальную систему**

```bash
git add landing-ai-agency/app/globals.css landing-ai-agency/tests/site-structure.test.mjs
git commit -m "feat: style editorial AI agency landing"
```

### Task 5: Добавить документацию и выполнить техническую проверку

**Files:**
- Create: `landing-ai-agency/README.md`
- Modify: `landing-ai-agency/tests/site-structure.test.mjs`

- [ ] **Step 1: Добавить тест README**

```js
test("README documents setup, build and bot link replacement", async () => {
  const readme = await read("README.md");
  for (const command of ["npm install", "npm run dev", "npm run build"]) {
    assert.match(readme, new RegExp(command.replaceAll(" ", "\\s+")));
  }
  assert.match(readme, /lib\/site-content\.ts/);
  assert.match(readme, /BOT_LINK/);
});
```

- [ ] **Step 2: Запустить тест и подтвердить падение**

Run: `cd landing-ai-agency; npm test`

Expected: новый тест падает с `ENOENT` для `README.md`.

- [ ] **Step 3: Написать README**

Документ содержит требования Node.js, команды `npm install`, `npm run dev`, `npm run build`, `npm start`, адрес локального сервера, путь `lib/site-content.ts` и инструкцию по замене `BOT_LINK`. Отдельно указать, что для monorepo deployment корневой директорией хостинга должна быть `landing-ai-agency/`.

- [ ] **Step 4: Выполнить полный технический прогон**

Run: `cd landing-ai-agency; npm test; npm run lint; npm run build`

Expected: все тесты проходят, ESLint завершается без ошибок, Next.js production build завершается успешно.

- [ ] **Step 5: Проверить отсутствие изменений бота**

Run: `git diff HEAD -- telegram-lead-bot`

Expected: пустой вывод.

- [ ] **Step 6: Закоммитить документацию**

```bash
git add landing-ai-agency/README.md landing-ai-agency/tests/site-structure.test.mjs
git commit -m "docs: add landing setup guide"
```

### Task 6: Визуально проверить адаптивность и взаимодействия

**Files:**
- Modify only if defects are found: `landing-ai-agency/app/page.tsx`
- Modify only if defects are found: `landing-ai-agency/app/globals.css`

- [ ] **Step 1: Запустить dev-сервер**

Run: `cd landing-ai-agency; npm run dev`

Expected: сервер сообщает локальный URL и готовность без ошибок.

- [ ] **Step 2: Проверить страницу на 1440 px**

Убедиться, что hero остаётся двухколоночным, терминал и стикеры не перекрывают CTA, секции имеют чёткую визуальную иерархию, а финальный CTA видим целиком.

- [ ] **Step 3: Проверить страницу на 1024 px**

Убедиться, что текст не обрезается, service-grid сохраняет читаемость, процесс не пересекается и горизонтального скролла нет.

- [ ] **Step 4: Проверить страницу на 390 px**

Убедиться, что hero одноколоночный, шапка помещается, CTA доступен, терминал не выходит за viewport, карточки и схема переходят в вертикальный поток.

- [ ] **Step 5: Проверить клавиатуру и ссылки**

Последовательно пройти интерактивные элементы клавишей Tab, подтвердить видимый focus и открыть header, hero и footer CTA. Все три должны вести на `https://t.me/testovy_bot_qualbot` в новой вкладке.

- [ ] **Step 6: Исправить найденные дефекты и повторить проверки**

Любое исправление ограничить `landing-ai-agency/`, затем повторить соответствующую ширину и `npm test; npm run lint; npm run build`.

- [ ] **Step 7: Закоммитить только при наличии визуальных исправлений**

```bash
git add landing-ai-agency/app/page.tsx landing-ai-agency/app/globals.css
git commit -m "fix: polish landing responsive layout"
```
