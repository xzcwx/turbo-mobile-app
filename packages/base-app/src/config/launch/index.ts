// 包Key类型
export type PACKAGE_MAP_TYPE =
  | typeof MAIN_NAME
  | typeof SUNDRY_NAME;

export const MAIN_NAME = "main";

// 大杂烩包名
export const SUNDRY_NAME = "sundry";

// 主包路径
export const MAIN_PACKAGE = "/packages/main/pages";

// Sundry分包路径
export const SUNDRY_PACKAGE = "/packages/sundry/pages";

// APP与H5主页
export const APP_HOME = MAIN_PACKAGE + "/home/index";

// APP与H5未登录页
export const APP_LOGIN = MAIN_PACKAGE + "/login/index";

// 小程序主页
export const APPLET_HOME = MAIN_PACKAGE + "/home/index";

// 包配置映射
export const PACKAGE_MAP = new Map<PACKAGE_MAP_TYPE, string>([
  [MAIN_NAME, MAIN_PACKAGE],
  [SUNDRY_NAME, SUNDRY_PACKAGE]
]);
