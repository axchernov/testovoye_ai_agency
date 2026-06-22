# AI Automation Landing

Автономный лендинг AI-агентства на Next.js. Проект не зависит от соседнего Telegram-бота и может деплоиться отдельно.

## Запуск

Требуется Node.js 20 или новее.

```bash
npm install
npm run dev
```

Откройте `http://localhost:3000`.

## Production build

```bash
npm run build
npm start
```

## Ссылка на Telegram-бота

Все CTA используют одну константу `BOT_LINK` в файле `lib/site-content.ts`. Замените значение этой константы, чтобы подключить другого бота.

## Деплой из общего репозитория

При создании проекта на Vercel, Netlify или другом хостинге укажите `landing-ai-agency/` как Root Directory. Команда сборки — `npm run build`.
