import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          mantine: [
            "@mantine/core",
            "@mantine/hooks",
            "@mantine/form",
            "@mantine/dates",
          ],
          redux: ["@reduxjs/toolkit", "react-redux", "redux-persist"],
          router: ["react-router-dom"],
          icons: ["react-icons"],
          utils: ["dayjs", "react-hook-form", "@hookform/resolvers"],
        },
      },
    },
  },
});
