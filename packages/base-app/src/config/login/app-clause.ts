/**
 * 此文件存放关于APP条款信息的配置项
 */

// sdk收集
export const SDK_TYPE = "sdk";
// 隐私协议
export const PRIVACY_TYPE = "privacy";
// 信息收集与使用清单
export const GATHER_TYPE = "gather";

export const sdk = `
`;
export const privacy = `
`;
export const gather = `
`;

// 条款类型映射
export const clauseMap = new Map<string, string>([
  [SDK_TYPE, sdk],
  [PRIVACY_TYPE, privacy],
  [GATHER_TYPE, gather]
]);
