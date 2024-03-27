/**
 * 此文件存放关于小程序、APP登录的配置项
 */

import {PRIVACY_TYPE, GATHER_TYPE, SDK_TYPE} from "./app-clause";

// export const BASE_IMAGE_DIR = `${import.meta.env.VITE_BASE_URL}/images/wechat/`;

// export const wximg = BASE_IMAGE_DIR + "common/weixin.png";

// export const logo = require("@/assets/xxx");

// 验证码等待时长
export const captchaWaitTime = 60 * 1000;

// Storage关键字
export const STORAGE_NAME = "_user_info";

// 登录条款
export const clauses = [
  {label: "《用户隐私协议》", to: PRIVACY_TYPE},
  {label: "《第三方SDK收集个人信息条款》", to: SDK_TYPE},
  {label: "《个人信息收集和使用清单》", to: GATHER_TYPE}
];
