import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: "/test/", // <-- add this
  base: "/", // <-- add this

  server: {
    host: true,
    port: 5174,
    historyApiFallback: true,
  },

  optimizeDeps: {
    exclude: ["lucide-react"],
  },
});
