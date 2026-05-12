import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Forward all /api/* requests from the Vite dev server (5173) to Flask (5001).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
      },
    },
  },
});
