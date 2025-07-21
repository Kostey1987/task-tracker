# Task Tracker Backend

## Стек технологий

- Node.js
- Express
- TypeScript
- SQLite
- JWT (jsonwebtoken)
- bcryptjs
- express-validator
- dotenv
- multer (загрузка файлов)
- sharp (проверка изображений)

## Структура проекта

```
backend/
  src/
    controllers/   # Бизнес-логика
    models/        # Работа с БД
    routes/        # Определение API
    middlewares/   # Middleware
    config/        # Настройки и инициализация БД
    app.ts         # Express-приложение
    index.ts       # Точка входа
  uploads/         # Загруженные изображения
  database.db      # Файл базы данных (SQLite)
  package.json     # Зависимости и скрипты
  .env             # Переменные окружения
```

## Переменные окружения (.env)

```
JWT_SECRET=your_super_secret_key
PORT=5000
```

## Команды для терминала

```sh
npm install         # Установка зависимостей
npm run dev         # Запуск сервера в режиме разработки (ts-node)
npm run build       # Сборка TypeScript в dist/
npm start           # Запуск собранного JS-кода из dist/
```

## Основные методы API

### Аутентификация

- **POST /api/auth/register** — регистрация пользователя
  - Body: `{ "name": string, "email": string, "password": string }`
- **POST /api/auth/login** — вход пользователя
  - Body: `{ "email": string, "password": string }`
  - Ответ: `{ "accessToken": string, "refreshToken": string }`
- **POST /api/auth/refresh** — обновление access токена
  - Body: `{ "refreshToken": string }`
  - Ответ: `{ "accessToken": string }`
- **POST /api/auth/logout** — выход пользователя (удаляет refresh токен)
  - Header: `Authorization: Bearer <accessToken>`

### Пользователь

- **PATCH /api/auth/update** — обновить имя пользователя
  - Header: `Authorization: Bearer <accessToken>`
  - Body: `{ "newName": string }`

### Задачи (требуется авторизация)

- **POST /api/tasks** — создать задачу (поддержка загрузки изображения)
  - Header: `Authorization: Bearer <accessToken>`
  - Body: `form-data`:
    - `description`: string (обязательно)
    - `deadline`: string (опционально, формат YYYY-MM-DDTHH:mm)
    - `image`: файл (опционально, изображение)
- **GET /api/tasks** — получить список задач
  - Header: `Authorization: Bearer <accessToken>`
  - Query: `page`, `limit`, `status`, `deadlineFrom`, `deadlineTo`
    - `deadlineFrom` — (опционально) дата и время в формате YYYY-MM-DDTHH:mm (ISO 8601), фильтрует задачи с дедлайном >= этой даты и времени
    - `deadlineTo` — (опционально) дата и время в формате YYYY-MM-DDTHH:mm (ISO 8601), фильтрует задачи с дедлайном <= этой даты и времени
    - Можно использовать оба параметра или только один
    - Пример: `/api/tasks?deadlineFrom=2024-06-01T09:00&deadlineTo=2024-06-30T18:00`
  - Query: `sortDeadline` (опционально)
    - `sortDeadline=asc` — сортировать задачи по дедлайну по возрастанию (сначала ближайшие)
    - `sortDeadline=desc` — сортировать задачи по дедлайну по убыванию (сначала самые поздние)
    - Пример: `/api/tasks?sortDeadline=asc`
- **PATCH /api/tasks/:id** — обновить задачу (можно заменить изображение)
  - Header: `Authorization: Bearer <accessToken>`
  - Body: `form-data`:
    - `description`, `status`, `deadline` (опционально)
    - `image`: файл (опционально, новое изображение)
- **DELETE /api/tasks/:id** — удалить задачу
  - Header: `Authorization: Bearer <accessToken>`
- **DELETE /api/tasks/:id/image** — удалить изображение задачи
  - Header: `Authorization: Bearer <accessToken>`

## Работа с изображениями

- Поддерживаются только изображения (jpeg, png, webp и др.)
- Максимальный размер файла: **5 МБ**
- Максимальное разрешение: **1920x1080**
- При обновлении задачи через PATCH можно заменить изображение (старое удаляется)
- Для удаления изображения используйте DELETE /api/tasks/:id/image
- При создании/редактировании задачи изображение опционально

## Типы данных

### User

```
{
  id: number,
  name: string,
  email: string,
  password: string (hash),
  refresh_token?: string
}
```

### Task

```
{
  id: number,
  description: string,
  status: "В работе" | "Готово" | "Просрочено",
  deadline?: string,
  image?: string, // путь к файлу, если есть
  user_id: number
}
```

## Примечания

- Access токен живёт 15 минут, refresh токен — до logout или повторного логина.
- Для всех защищённых маршрутов требуется заголовок `Authorization: Bearer <accessToken>`.
- Для обновления access токена используйте refresh токен.
- После logout refresh токен становится невалидным.
- Для загрузки/редактирования изображения используйте тип запроса `form-data`.
