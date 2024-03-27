"use strict";
import Http from "./instance";
import type { HttpRequestConfig, HttpMethod } from "luch-request";

export function get(url: string, params?: UnknownObject, options?: HttpRequestConfig) {
  const opts = { params };
  options && Object.assign(opts, options);

  return request(url, { method: "GET", ...opts });
}

export function post(url: string, data?: UnknownObject, options?: HttpRequestConfig) {
  const opts = { data };
  options && Object.assign(opts, options);

  return request(url, { method: "POST", ...opts });
}

export function pull(url: string, data?: UnknownObject, options?: HttpRequestConfig) {
  const opts = { data };
  options && Object.assign(opts, options);

  return request(url, { method: "PULL", ...opts });
}

export function _delete(url: string, data?: UnknownObject, options?: HttpRequestConfig) {
  const opts = { data };
  options && Object.assign(opts, options);

  return request(url, { method: "DELETE", ...opts });
}

export function request<T = any>(
  url: string,
  options: Omit<HttpRequestConfig, "method"> & { method?: string }
): Promise<T> {
  const opts: HttpRequestConfig = Object.assign({ method: "GET" }, options) as HttpRequestConfig;
  // 请求方法统一转换成小写
  if (opts.method && /[a-z]+/i.test(opts.method)) {
    opts.method = opts.method.toLowerCase() as HttpMethod;
  }
  // GET对称DATA
  if (opts.method === "GET") {
    Object.assign(opts.params ?? {}, opts.data ?? {});
  }

  return Http.request({ url, ...opts });
}

export default request;
