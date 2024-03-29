import path from "path";
import uni from "@dcloudio/vite-plugin-uni";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [uni()],
  optimizeDeps: {
    include: ["luch-request"]
  },
  resolve: {
    //设置别名
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@main": path.resolve(__dirname, "src/packages/main"),
      "@sundry": path.resolve(__dirname, "src/packages/sundry")
    }
  }
});
