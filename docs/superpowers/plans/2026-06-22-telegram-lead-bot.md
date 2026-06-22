# Telegram Lead Bot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать самостоятельный TypeScript/Telegraf-бот, который получает согласие, последовательно квалифицирует B2B-лида и отправляет оформленную заявку в личный Telegram администратора.

**Architecture:** Линейный типизированный state machine хранит состояние пользователей в `Map`. Данные вопросов, валидация, форматирование заявки и Telegram-обработчики разделены на небольшие модули; чистые модули тестируются встроенным `node:test`, а Telegraf остаётся тонким транспортным слоем.

**Tech Stack:** Node.js 20+, TypeScript, Telegraf, dotenv, tsx, node:test.

---

## Структура файлов

- `telegram-lead-bot/package.json` — зависимости и команды запуска/проверки.
- `telegram-lead-bot/tsconfig.json` — строгая ESM-сборка в `dist/`.
- `telegram-lead-bot/.env.example` — контракт переменных окружения.
- `telegram-lead-bot/src/types.ts` — типы ключей ответов, вопросов и состояния.
- `telegram-lead-bot/src/questions.ts` — 13 вопросов в буквальном порядке ТЗ.
- `telegram-lead-bot/src/validation.ts` — непустой ввод, email и телефон.
- `telegram-lead-bot/src/state.ts` — `Map` и операции жизненного цикла анкеты.
- `telegram-lead-bot/src/formatLead.ts` — текст заявки для администратора.
- `telegram-lead-bot/src/bot.ts` — команды, кнопки, переходы и отправка заявки.
- `telegram-lead-bot/src/index.ts` — env-конфигурация и long polling.
- `telegram-lead-bot/tests/*.test.ts` — модульные тесты чистой логики.
- `telegram-lead-bot/README.md` — настройка личной доставки и проверка сценария.

### Task 1: Каркас самостоятельного проекта

**Files:**
- Create: `telegram-lead-bot/package.json`
- Create: `telegram-lead-bot/tsconfig.json`
- Create: `telegram-lead-bot/.gitignore`
- Create: `telegram-lead-bot/.env.example`

- [ ] **Step 1: Создать package manifest**

Задать `type: module`, runtime-зависимости `telegraf` и `dotenv`, dev-зависимости `typescript`, `tsx`, `@types/node`, а также scripts:

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -p tsconfig.json",
    "start": "node dist/index.js",
    "test": "tsx --test tests/**/*.test.ts"
  }
}
```

- [ ] **Step 2: Добавить строгую TypeScript-конфигурацию**

Использовать `module` и `moduleResolution: NodeNext`, `strict: true`, `rootDir: src`, `outDir: dist`, `target: ES2022`.

- [ ] **Step 3: Добавить env-контракт и исключения Git**

`.env.example` содержит ровно:

```dotenv
BOT_TOKEN=your_telegram_bot_token
ADMIN_CHAT_ID=your_admin_chat_id
```

Игнорировать `.env`, `node_modules/`, `dist/`.

- [ ] **Step 4: Установить зависимости и проверить пустую сборку конфигурации**

Run: `cd telegram-lead-bot; npm install`
Expected: зависимости установлены, audit не блокирует установку.

- [ ] **Step 5: Commit**

```bash
git add telegram-lead-bot/package.json telegram-lead-bot/package-lock.json telegram-lead-bot/tsconfig.json telegram-lead-bot/.gitignore telegram-lead-bot/.env.example
git commit -m "chore: scaffold telegram lead bot"
```

### Task 2: Контракт вопросов и их буквальный порядок

**Files:**
- Create: `telegram-lead-bot/src/types.ts`
- Create: `telegram-lead-bot/src/questions.ts`
- Create: `telegram-lead-bot/tests/questions.test.ts`

- [ ] **Step 1: Написать падающий тест структуры анкеты**

Проверить `questions.length === 13`, последовательность ключей
`companyName, website, industry, employeeCount, annualRevenue, supportPayroll, painPoint, startTime, budget, contactName, phone, email, otherContacts`, типы `choice` на шагах 4, 5, 8, 9 и точные варианты из ТЗ.

- [ ] **Step 2: Запустить тест и подтвердить падение**

Run: `npm test -- tests/questions.test.ts`
Expected: FAIL, модуль `src/questions.js` ещё отсутствует.

- [ ] **Step 3: Реализовать типы и вопросы**

Определить discriminated union:

```ts
export type TextQuestion = { key: AnswerKey; type: "text"; text: string; hint?: string; validation?: "phone" | "email" };
export type ChoiceQuestion = { key: AnswerKey; type: "choice"; text: string; options: readonly string[] };
export type Question = TextQuestion | ChoiceQuestion;
```

Экспортировать `questions` как `readonly Question[]` с буквальными русскими текстами и подсказками из ТЗ.

- [ ] **Step 4: Запустить тесты**

Run: `npm test -- tests/questions.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add telegram-lead-bot/src/types.ts telegram-lead-bot/src/questions.ts telegram-lead-bot/tests/questions.test.ts
git commit -m "feat: define qualification questions"
```

### Task 3: Валидация и in-memory состояние

**Files:**
- Create: `telegram-lead-bot/src/validation.ts`
- Create: `telegram-lead-bot/src/state.ts`
- Create: `telegram-lead-bot/tests/validation.test.ts`
- Create: `telegram-lead-bot/tests/state.test.ts`

- [ ] **Step 1: Написать падающие тесты валидации**

Проверить, что `validateText` отклоняет пробельную строку; `validateEmail` принимает `ivan@example.ru` и отклоняет `ivan@`, `@example.ru`, `ivan@example`; `validatePhone` принимает `+7 (999) 123-45-67` и отклоняет буквы, 9 и 16 цифр.

- [ ] **Step 2: Написать падающие тесты состояния**

Проверить, что `startSurvey(userId)` создаёт `{ step: 0, answers: {} }`, `saveAnswer` записывает значение и увеличивает шаг, а `clearSurvey` удаляет запись из экспортируемого `userStates`.

- [ ] **Step 3: Запустить тесты и подтвердить падение**

Run: `npm test -- tests/validation.test.ts tests/state.test.ts`
Expected: FAIL из-за отсутствующих модулей.

- [ ] **Step 4: Реализовать минимальную чистую логику**

Телефон проверять разрешёнными символами `/^\+?[\d\s()-]+$/` и количеством цифр 10–15. Email проверять компактным выражением `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`. Состояние хранить строго в `Map<number, SurveyState>`.

- [ ] **Step 5: Запустить тесты**

Run: `npm test -- tests/validation.test.ts tests/state.test.ts`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add telegram-lead-bot/src/validation.ts telegram-lead-bot/src/state.ts telegram-lead-bot/tests/validation.test.ts telegram-lead-bot/tests/state.test.ts
git commit -m "feat: add lead validation and state"
```

### Task 4: Форматирование заявки

**Files:**
- Create: `telegram-lead-bot/src/formatLead.ts`
- Create: `telegram-lead-bot/tests/formatLead.test.ts`

- [ ] **Step 1: Написать падающий тест полного сообщения**

Создать все 13 ответов и Telegram user `{ id: 42, username: "ivan", first_name: "Иван" }`; проверить точное сообщение с заголовком `🆕 Новая заявка на AI-автоматизацию`, всеми emoji-полями и блоком Telegram user. Добавить кейс отсутствующего username, который выводится как `не указан`.

- [ ] **Step 2: Запустить тест и подтвердить падение**

Run: `npm test -- tests/formatLead.test.ts`
Expected: FAIL, `formatLead` отсутствует.

- [ ] **Step 3: Реализовать formatter**

Сигнатура:

```ts
export function formatLead(answers: LeadAnswers, user: TelegramUser): string
```

Значения вставляются как plain text без `parse_mode`, чтобы пользовательский ввод не ломал Telegram-разметку.

- [ ] **Step 4: Запустить тест**

Run: `npm test -- tests/formatLead.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add telegram-lead-bot/src/formatLead.ts telegram-lead-bot/tests/formatLead.test.ts
git commit -m "feat: format admin lead message"
```

### Task 5: Telegram-сценарий и конфигурация

**Files:**
- Create: `telegram-lead-bot/src/bot.ts`
- Create: `telegram-lead-bot/src/index.ts`
- Create: `telegram-lead-bot/tests/config.test.ts`
- Modify: `telegram-lead-bot/src/types.ts`

- [ ] **Step 1: Написать падающие тесты env parsing**

Вынести `readConfig(env)` из запуска и проверить: отсутствующий `BOT_TOKEN` бросает понятную ошибку; пустой или нечисловой `ADMIN_CHAT_ID` возвращает `undefined`; отрицательный numeric id остаётся допустимым для совместимости с группами, хотя основной сценарий использует личный положительный id.

- [ ] **Step 2: Запустить тест и подтвердить падение**

Run: `npm test -- tests/config.test.ts`
Expected: FAIL, `readConfig` отсутствует.

- [ ] **Step 3: Реализовать `readConfig` и обработчики**

Зарегистрировать `/start`, `/reset`, actions `consent:yes`, `consent:no`, `answer:<questionIndex>:<optionIndex>` и `bot.on(message("text"))`. Callback сверяет текущий индекс, чтобы устаревшая кнопка не могла изменить другой шаг. `askCurrentQuestion` строит inline keyboard для choice и обычный текст для text.

На финальном шаге вызвать `ctx.telegram.sendMessage(adminChatId, formatLead(...))`, затем отправить точный текст благодарности и очистить state. При ошибке доставки логировать её, оставить последний шаг активным и сообщить о временной ошибке. `bot.catch` логирует неожиданные ошибки обновлений.

- [ ] **Step 4: Реализовать запуск long polling**

`index.ts` вызывает `dotenv.config()`, читает конфигурацию, предупреждает об отсутствующем `ADMIN_CHAT_ID`, создаёт бота, вызывает `bot.launch()` и корректно останавливает его по `SIGINT`/`SIGTERM`.

- [ ] **Step 5: Запустить тесты и TypeScript-сборку**

Run: `npm test`
Expected: все tests PASS.

Run: `npm run build`
Expected: exit 0, JavaScript создан в `dist/`.

- [ ] **Step 6: Commit**

```bash
git add telegram-lead-bot/src/bot.ts telegram-lead-bot/src/index.ts telegram-lead-bot/src/types.ts telegram-lead-bot/tests/config.test.ts
git commit -m "feat: implement telegram qualification flow"
```

### Task 6: README и финальная проверка

**Files:**
- Create: `telegram-lead-bot/README.md`

- [ ] **Step 1: Документировать установку и личную доставку**

Описать `npm install`, копирование `.env.example` в `.env`, создание бота через `@BotFather`, получение личного id через `@userinfobot` или Telegram API, обязательный `/start` администратором, `npm run dev`, `npm run build`, `npm start` и `npm test`.

- [ ] **Step 2: Добавить ручной acceptance-сценарий**

Проверить согласие/отказ, каждый тип вопроса, невалидные телефон/email, `/reset`, повторный `/start`, неправильный текст на choice-шаге и получение полного личного сообщения администратором.

- [ ] **Step 3: Выполнить полную проверку**

Run: `npm test`
Expected: все tests PASS.

Run: `npm run build`
Expected: exit 0.

Run: `git diff --check`
Expected: нет ошибок пробелов.

- [ ] **Step 4: Commit**

```bash
git add telegram-lead-bot/README.md
git commit -m "docs: add telegram bot setup guide"
```
