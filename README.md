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

### 📋 Предварительные требования

1. **Node.js** (версия 18 или выше)

   ```bash
   node --version
   npm --version
   ```

2. **Git** (для клонирования репозитория)

### 🚀 Пошаговая инструкция

#### Шаг 1: Клонирование проекта

```bash
git clone <URL_репозитория>
cd task-tracker
```

#### Шаг 2: Установка зависимостей

```bash
npm run install:all
```

Эта команда установит зависимости для:

- Корневого проекта
- Backend (Node.js + Express)
- Frontend (React + Vite)

#### Шаг 3: Настройка переменных окружения

**Для Backend:**

```bash
cd backend
cp env.example .env
```

Отредактируйте файл `backend/.env`:

```env
PORT=5000
HOST=0.0.0.0
NODE_ENV=development
JWT_SECRET=your_super_secret_key_change_in_production
FRONTEND_URL=http://localhost:5173
```

**Для Frontend:**

```bash
cd ../frontend
cp env.example .env
```

Отредактируйте файл `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
VITE_APP_VERSION=1.0.0
```

#### Шаг 4: Запуск приложения

**Вариант 1: Запуск всего проекта одновременно**

```bash
cd ..  # вернуться в корневую папку
npm run dev
```

**Вариант 2: Запуск по отдельности**

Backend:

```bash
cd backend
npm run dev
```

Frontend (в новом терминале):

```bash
cd frontend
npm run dev
```

#### Шаг 5: Проверка работы

После запуска приложение будет доступно по адресам:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

### ⚠️ Возможные проблемы и решения

1. **Порт занят**: Если порты 5000 или 5173 заняты, измените их в `.env` файлах

2. **Ошибки зависимостей**: Удалите `node_modules` и `package-lock.json`, затем переустановите:

   ```bash
   rm -rf node_modules package-lock.json
   npm run install:all
   ```

3. **Проблемы с TypeScript**: Убедитесь, что установлена совместимая версия TypeScript

4. **Проблемы с базой данных**: SQLite файл создается автоматически при первом запуске

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
