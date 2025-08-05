# 🚀 Деплой фронтенда Task Tracker

## Варианты деплоя

### 1. Vercel (Рекомендуется)

#### Автоматический деплой через GitHub:
1. Запушите код в GitHub репозиторий
2. Перейдите на [vercel.com](https://vercel.com)
3. Подключите ваш GitHub репозиторий
4. Настройте проект:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

#### Переменные окружения в Vercel:
```
VITE_API_URL=https://task-tracker-8mad.onrender.com
VITE_APP_VERSION=1.0.0
```

### 2. Netlify

#### Автоматический деплой:
1. Запушите код в GitHub
2. Перейдите на [netlify.com](https://netlify.com)
3. Подключите репозиторий
4. Настройте:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`

#### Переменные окружения в Netlify:
```
VITE_API_URL=https://task-tracker-8mad.onrender.com
VITE_APP_VERSION=1.0.0
```

### 3. GitHub Pages

#### Настройка:
1. Создайте файл `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: |
        cd frontend
        npm install
        
    - name: Build
      run: |
        cd frontend
        npm run build
      env:
        VITE_API_URL: https://task-tracker-8mad.onrender.com
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./frontend/dist
```

## 🔧 Локальная сборка для тестирования

```bash
cd frontend
npm install
npm run build
```

## 📝 Важные моменты

1. **API URL**: Убедитесь, что `VITE_API_URL` указывает на ваш развернутый бэкенд
2. **CORS**: Бэкенд уже настроен для работы с фронтендом
3. **Роутинг**: Настроены редиректы для SPA (Single Page Application)
4. **Переменные окружения**: Все переменные должны начинаться с `VITE_`

## 🌐 После деплоя

После успешного деплоя вы получите URL вида:
- Vercel: `https://your-app.vercel.app`
- Netlify: `https://your-app.netlify.app`
- GitHub Pages: `https://username.github.io/repo-name`

## 🔍 Тестирование

1. Откройте развернутое приложение
2. Зарегистрируйтесь или войдите
3. Создайте несколько задач
4. Проверьте все функции (создание, редактирование, удаление, фильтрация)

## 🛠️ Устранение проблем

### Проблема: API запросы не работают
**Решение**: Проверьте переменную `VITE_API_URL` в настройках деплоя

### Проблема: Страницы не загружаются при прямом переходе
**Решение**: Убедитесь, что настроены редиректы для SPA

### Проблема: CORS ошибки
**Решение**: Проверьте настройки CORS на бэкенде 