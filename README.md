# Shawa Browser Chat GPT v2 (Public Edition) - Dark Theme

**Shawa Browser Chat GPT** — лёгкий Chromium-браузер на Electron с интеграцией OpenAI Chat (streaming), тёмной темой и готовым CI для сборки Windows-installer.

## Быстрый старт (локально)
1. Скопируй репозиторий на Windows-машину.
2. Установи Node.js (рекомендуется 18+).
3. В корне проекта создай `.env` с содержимым:
```
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```
4. Установи зависимости и запусти:
```
npm install
npm install --save-dev electron electron-builder
npm start
```
5. Откроется приложение. В `Settings` можно временно сохранить API-ключ (localStorage) и выбрать модель.

## CI / Build (GitHub Actions)
- При пуше в `main` workflow автоматически соберёт Windows .exe и загрузит артфакт.
- Для публичного релиза убедись, что не вшил секретные ключи в репозиторий (используй `.env` и секреты GitHub, если нужно).

## Файлы
- `main.js`, `preload.js`, `index.html` — основа приложения.
- `assets/shawa-logo.png` — тёмный логотип.
- `.github/workflows/windows-build.yml` — CI для сборки .exe.
- `.env.example` — пример конфигурации.

---
🚀 Created by **Shawanlik** with **ChatGPT-5**
