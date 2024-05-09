import LRequest from "luch-request";
import { enableErrorToast, statusCodeMsg } from "@/config/http";
import type { HttpRequestConfig, HttpResponse, HttpError } from "luch-request";
// @ts-ignore
import {
  debuggerEnabled,
  debuggerModule
  // @ts-ignore
} from "@/uni_modules/imengyu-IMDebuggerWindow/common/debuggerExtern.js";

const http = new LRequest({
  // @ts-ignore
  baseURL: import.meta.env.VITE_BASE_URL,
  // baseURL: import.meta.env.VITE_BASE_URL + "/api",
  timeout: 60 * 1000
});

function requestInterceptors(config: HttpRequestConfig) {
  const { header, custom: { loadingToast = true } = {} } = config;
  // ToKen 处理
  const { token } = uni.getStorageSync("_user_info") ?? {};

  header!.Authorization = token;

  loadingToast && uni.showLoading({
    mask: true,
    title: "加载中~"
  });
  return config;
}

function responseInterceptors(response: HttpResponse) {
  const {
    statusCode,
    data = {},
    config: { url, method }
  } = response;

  uni.hideLoading();
  console?.groupCollapsed?.(`api: ${response.config.url}`);
  console?.log(`api: ${response.config.url}`);
  console?.log(`data: ${response.config?.data}`);
  console?.log(response);
  console?.groupEnd?.();

  /* debug调试工具配置 */
  if (debuggerEnabled()) {
    debuggerModule.addNetworkLog(
      {
        url,
        method,
        status: statusCode,
        sourceUrl: url
      },
      // 请求数据，将显示在Option字段中
      response.config,
      // 返回数据，将显示在Data字段中
      data
    );
  }

  // 服务端自定义错误状态码处理
  if (data.code && !data.success && Number(data.code) !== 200) {
    responseError({ ...response, statusCode: Number(data.code) });
  }
  return data;
}

function responseError(response: HttpError) {
  const {
    data, statusCode,
    config: {
      url, method,
      custom: { toast = true, rasie = true } = {}
    }
  } = response;
  const { msg, message } = data ?? {};

  uni.hideLoading();
  // 错误信息提示
  if (msg || message || (statusCode && statusCodeMsg.has(statusCode))) {
    enableErrorToast && toast && uni.showToast({
      title: message || msg || statusCodeMsg.get(statusCode!),
      icon: "none",
      mask: true
    });
  }
  switch (statusCode) {
    case 401:
      // 401 状态码特殊处理，可做登录页重定向操作
      break;
    case 404:
      // 404 状态码特殊处理
      break;
    default:
      // 状态码额外处理
      if (rasie) {
        throw new Error(`xzTips: HTTP请求异常，状态码: ${statusCode}, 请求地址: ${url}`);
      }
  }

}

http.interceptors.request.use(requestInterceptors);

http.interceptors.response.use(responseInterceptors, responseError);

export default http;
