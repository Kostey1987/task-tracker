# 🚀 Деплой Task Tracker на Fly.io

## 📋 Предварительные требования

1. **Установите Fly CLI:**

   ```bash
   # macOS
   brew install flyctl

   # Windows
   powershell -Command "iwr https://fly.io/install.ps1 -useb | iex"

   # Linux
   curl -L https://fly.io/install.sh | sh
   ```

2. **Авторизуйтесь в Fly.io:**
   ```bash
   fly auth login
   ```

## 🐳 Деплой Backend

### 1. Перейдите в папку backend:

```bash
cd backend
```

### 2. Создайте приложение:

```bash
fly apps create task-tracker-backend
```

### 3. Создайте volume для загруженных файлов:

```bash
fly volumes create task_tracker_data --size 1 --region fra
```

### 4. Установите секреты:

```bash
fly secrets set JWT_SECRET="your_very_secure_secret_key_here"
fly secrets set FRONTEND_URL="https://task-tracker-frontend.fly.dev"
```

### 5. Деплой:

```bash
fly deploy
```

### 6. Получите URL backend:

```bash
fly status
# Скопируйте URL, например: https://task-tracker-backend.fly.dev
```

## 🎨 Деплой Frontend

### 1. Перейдите в папку frontend:

```bash
cd ../frontend
```

### 2. Создайте приложение:

```bash
fly apps create task-tracker-frontend
```

### 3. Установите переменные окружения:

```bash
fly secrets set VITE_API_URL="https://task-tracker-backend.fly.dev"
```

### 4. Деплой:

```bash
fly deploy
```

### 5. Получите URL frontend:

```bash
fly status
# Скопируйте URL, например: https://task-tracker-frontend.fly.dev
```

## 🔧 Обновление переменных окружения

### Backend:

```bash
cd backend
fly secrets set JWT_SECRET="new_secret_key"
fly secrets set FRONTEND_URL="https://new-frontend-url.fly.dev"
fly deploy
```

### Frontend:

```bash
cd frontend
fly secrets set VITE_API_URL="https://new-backend-url.fly.dev"
fly deploy
```

## 📊 Мониторинг

### Просмотр логов:

```bash
# Backend
cd backend
fly logs

# Frontend
cd frontend
fly logs
```

### Статус приложений:

```bash
# Backend
cd backend
fly status

# Frontend
cd frontend
fly status
```

### Масштабирование:

```bash
# Увеличить количество машин
fly scale count 2

# Уменьшить количество машин
fly scale count 1
```

## 🗑️ Удаление приложений

### Удалить frontend:

```bash
cd frontend
fly apps destroy task-tracker-frontend
```

### Удалить backend:

```bash
cd backend
fly apps destroy task-tracker-backend
```

### Удалить volume:

```bash
fly volumes destroy task_tracker_data
```

## 🔍 Troubleshooting

### Проблемы с CORS:

1. Проверьте, что `FRONTEND_URL` в backend совпадает с реальным URL frontend
2. Убедитесь, что используется HTTPS

### Проблемы с загрузкой изображений:

1. Проверьте, что volume создан и подключен
2. Убедитесь, что папка `/app/uploads` существует

### Проблемы с базой данных:

1. SQLite файл создается автоматически
2. Проверьте права доступа к папке

## 💰 Стоимость

- **Бесплатный план**: 3 shared-cpu-1x 256mb VMs
- **Backend**: 1 VM (256MB RAM)
- **Frontend**: 1 VM (256MB RAM)
- **Volume**: 1GB storage
- **Итого**: В пределах бесплатного плана

## 🔗 Полезные ссылки

- [Fly.io Documentation](https://fly.io/docs/)
- [Fly CLI Commands](https://fly.io/docs/flyctl/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
