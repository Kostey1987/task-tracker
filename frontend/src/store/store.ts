import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import tasksUIReducer from "./tasksUISlice";
import { api } from "../services/api";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Конфигурация для сохранения состояния в localStorage
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "tasksUI"], // Сохраняем только auth и tasksUI
};

// Объединяем все reducers в один корневой reducer
const rootReducer = combineReducers({
  auth: authReducer, // Состояние аутентификации
  tasksUI: tasksUIReducer, // Состояние UI задач
  [api.reducerPath]: api.reducer, // RTK Query reducer
});

// Создаем persisted reducer для сохранения состояния
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Создаем Redux store с настройками
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Игнорируем действия Redux Persist при проверке сериализации
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(api.middleware), // Добавляем RTK Query middleware
});

// Создаем persistor для управления сохранением состояния
export const persistor = persistStore(store);
