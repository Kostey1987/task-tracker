# Task Tracker Frontend

## Стек технологий

- **React** — библиотека для построения пользовательских интерфейсов
- **TypeScript** — типизация для повышения надежности кода
- **Vite** — современный сборщик и dev-сервер
- **Mantine** — UI-компоненты и стилизация
- **Redux Toolkit** — современное управление состоянием
- **RTK Query** — асинхронные запросы и кэширование данных
- **Redux Persist** — сохранение состояния (токены) между сессиями
- **Tabler Icons** — иконки интерфейса
- **dayjs** — работа с датами и временем

## Конфигурация

### Переменные окружения

Скопируйте `env.example` в `.env` и настройте переменные:

#### Development (.env)

```bash
# Оставьте пустым для автоматического использования localhost:5000
VITE_API_URL=
```

#### Production (.env)

```bash
# Укажите URL вашего backend API
VITE_API_URL=https://your-backend-domain.com
```

### Настройка для разных окружений

- **Development**: `VITE_API_URL=http://localhost:5000`
- **Staging**: `VITE_API_URL=https://staging-api.example.com`
- **Production**: `VITE_API_URL=https://api.example.com`

## Реализованный функционал

- **Аутентификация**
  - Регистрация и вход пользователя
  - Хранение access и refresh токенов (Redux Persist)
  - Автоматическое обновление access токена по refresh токену (refresh flow)
  - Logout с удалением токенов
- **Работа с задачами (Task Management)**
  - CRUD: создание, просмотр, редактирование, удаление задач
  - Фильтрация задач по статусу
  - Поиск задач по описанию
  - Сортировка задач по дедлайну
  - Загрузка и удаление изображений к задачам
  - Визуальное отображение статуса задачи (цвет, иконка, фон)
- **Профиль пользователя**
  - Просмотр и изменение имени пользователя
- **UI и UX**
  - Современный адаптивный дизайн (Mantine)
  - Адаптация под мобильные устройства
  - Единый стиль для всех страниц и компонентов
- **Безопасность**
  - Все защищённые запросы используют access token
  - При истечении access token происходит автоматический refresh

## Запуск проекта

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Создайте файл `.env` с настройками API (см. раздел "Конфигурация")
3. Запустите dev-сервер:
   ```bash
   npm run dev
   ```
4. Откройте [http://localhost:5173](http://localhost:5173) в браузере.

---

> Для работы необходим запущенный backend (см. папку `../backend`).
