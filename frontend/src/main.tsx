import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

// Точка входа в приложение
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Провайдер UI библиотеки Mantine */}
    <MantineProvider>
      {/* Провайдер Redux store */}
      <Provider store={store}>
        {/* Gate для восстановления состояния из localStorage */}
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </Provider>
    </MantineProvider>
  </React.StrictMode>
);
