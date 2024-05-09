// 开启全局HTTP请求错误提示，若想局部关闭提示请使用请求配置中custom.toast
export const enableErrorToast = true;

export const statusCodeMsg = new Map<string | number, string>([
  [401, "请先进行身份验证"],
  [404, "未找到请求资源"],
  [403, "服务器拒绝此次请求"],
  [408, "请求超时，请重新尝试"],
  [500, "服务器异常"],
  [504, "服务器网络超时"],
]);
