# Task Tracker

Современное веб-приложение для управления задачами с возможностью загрузки изображений.

## 🚀 Технологии

### Backend

- **Node.js** + **Express** - серверная часть
- **TypeScript** - типизация
- **SQLite** - база данных
- **JWT** - аутентификация
- **Multer** - загрузка файлов
- **Sharp** - обработка изображений

### Frontend

- **React** + **TypeScript** - клиентская часть
- **Vite** - сборщик и dev-сервер
- **Mantine** - UI компоненты
- **Redux Toolkit** + **RTK Query** - управление состоянием
- **Redux Persist** - сохранение состояния

## 📁 Структура проекта

```
task-tracker/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── controllers/  # Бизнес-логика
│   │   ├── models/       # Работа с БД
│   │   ├── routes/       # API маршруты
│   │   ├── middlewares/  # Middleware
│   │   └── config/       # Конфигурация
│   └── uploads/          # Загруженные изображения
├── frontend/         # React приложение
│   ├── src/
│   │   ├── components/   # React компоненты
│   │   ├── pages/        # Страницы
│   │   ├── services/     # API сервисы
│   │   ├── store/        # Redux store
│   │   └── hooks/        # Кастомные hooks
│   └── public/           # Статические файлы
└── package.json      # Корневые скрипты
```

## 🛠 Установка и запуск

### 1. Установка зависимостей

```bash
npm run install:all
```

### 2. Настройка переменных окружения

**Backend** (`backend/.env`):

```bash
PORT=5000
HOST=localhost
NODE_ENV=development
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):

```bash
VITE_API_URL=http://localhost:5000
```

### 3. Запуск в режиме разработки

```bash
npm run dev
```

Это запустит:

- Backend на http://localhost:5000
- Frontend на http://localhost:5173

### 4. Отдельный запуск

**Backend:**

```bash
cd backend
npm run dev
```

**Frontend:**

```bash
cd frontend
npm run dev
```

## ✨ Функционал

### 🔐 Аутентификация

- Регистрация и вход пользователей
- JWT токены (access + refresh)
- Автоматическое обновление токенов
- Защищенные маршруты

### 📋 Управление задачами

- Создание, редактирование, удаление задач
- Загрузка изображений к задачам
- Фильтрация по статусу и датам
- Сортировка по дедлайну
- Поиск по описанию

### 🎨 UI/UX

- Современный адаптивный дизайн
- Мобильная версия
- Красивые уведомления об ошибках
- Интуитивный интерфейс

## 📚 Документация

- [Backend API](./backend/README.md) - документация API
- [Frontend Guide](./frontend/README.md) - руководство по frontend
- [Postman Collection](./task-tracker-api.postman_collection.json) - коллекция для тестирования API

## 🔧 Разработка

### Доступные команды

```bash
npm run dev              # Запуск backend + frontend
npm run dev:backend      # Только backend
npm run dev:frontend     # Только frontend
npm run build            # Сборка проекта
npm run install:all      # Установка всех зависимостей
```

### Структура API

Все API endpoints начинаются с `/api`:

- `/api/auth/*` - аутентификация
- `/api/tasks/*` - управление задачами

## 🚀 Деплой

Проект готов к деплою на различные платформы.

Подробные инструкции по деплою см. в документации каждого компонента.

## 📄 Лицензия

MIT License - см. файл [LICENSE](./LICENSE)
