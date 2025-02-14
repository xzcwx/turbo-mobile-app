/* Base Import Here */
import { createSSRApp } from "vue";
import App from "./App.vue";
import * as Pinia from "pinia";

/* Config Import Here */
import { PACKAGE_MAP } from "@/config/launch";
import { Router } from "@/utils/xzUniHelper";

/* Global Components Import Here */

export function createApp() {
  const app = createSSRApp(App);
  const store = Pinia.createPinia();

  app.use(store);
  return { app, Pinia };
}

export function main() {
  // 路由子包配置
  for (const [name, base] of PACKAGE_MAP.entries()) {
    Router.addSon(name, { base });
  }
}

// 程序执行入口
main();
