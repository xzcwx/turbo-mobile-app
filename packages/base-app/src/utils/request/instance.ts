import LRequest from "luch-request";
import type { HttpRequestConfig, HttpResponse } from "luch-request";
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
  const { header, custom: { unLoading } = {} } = config;
  // ToKen 处理
  const { token } = uni.getStorageSync("_user_info") ?? {};

  header!.Authorization = token;

  if (!unLoading) {
    uni.showLoading({
      mask: true,
      title: "加载中~"
    });
  }

  return config;
}

function responseInterceptors(response: HttpResponse) {
  const {
    data,
    statusCode,
    config: { url, method }
  } = response;

  console?.groupCollapsed?.(`api: ${response.config.url}`);
  console?.debuglog(`api: ${response.config.url}`);
  console?.debuglog(`data: ${response.config?.data}`);
  console?.debuglog(response);
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

  switch (statusCode) {
    case 200:
      break;
    default:
    // TODO 状态码额外处理
  }

  return data;
}

function responseError() {}

http.interceptors.request.use(requestInterceptors);

http.interceptors.response.use(responseInterceptors, responseError);

export default http;
