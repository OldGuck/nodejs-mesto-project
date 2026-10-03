# Бэкенд Mesto. Каркас API Mesto

## Используемые технологии и решения
- Typescript в качестве основного языка проекта
- Mongodb и ODM Mongoose для хранения данных пользователей
- Node.js в качестве среды выполнения
- Express как веб-фреймворк
- ESLint (airbnb-base) для проверки стиля кода
- ts-node-dev для запуска с хот-релоудом

## Установка зависимостей
- `npm install` - устанавливает все зависимости в папке проекта через терминал

## Запуск MongoDB
- Windows: откройте services.msc и убедитесь, что служба MongoDB Server находится в статусе «Выполняется»
- macOS: brew services start mongodb-community
- Linux: sudo systemctl start mongod

## Доступные команды
- `npm run lint` - запускает ESLint и проверяет весь проект на соответствие стилю кода (airbnb-base)
- `npm run build` - компилирует TypeScript в JavaScript. Результат сборки попадает в папку `dist/` согласно настройкам `tsconfig.json`
- `npm run dev` - запускает сервер в режиме разработки с хот-релоудом через `ts-node-dev`. При изменении любого файла в `src/` сервер автоматически перезапускается
- `npm run start` - запускает сервер без хот-релоуда через `ts-node`
- `npm test` - заглушка для будущих тестов
