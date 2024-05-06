/**
 * 公共辅助性函数
 */
// @ts-ignore
import { format, formatDistanceToNow, compareAsc, add } from "date-fns";
// @ts-ignore
import { zhCN } from "date-fns/locale";

import type {
  NodeField,
  NodeInfo,
  ConfirmHintOpts,
  JointUrl,
  RouterPush,
  RouterDerive
} from "./xzUniHelper.d";

// 路由辅助类
export class Router {
  static son: { [name: string]: Router } = {};

  static push(url: string, { query, replace = false }: RouterPush = {}) {
    const turl = jointUrl({ url, query });
    const func = replace ? uni.redirectTo : uni.navigateTo;

    func({
      url: turl,
      fail: ({ errMsg }: Record<string, string> = {}) => {
        // Error: redirectTo:fail can not redirectTo a tabbar page👇
        if (errMsg && /redirectTo\s?a\s?tabbar/.test(errMsg)) {
          return uni.switchTab({ url: turl });
        }
        throw new Error(errMsg);
      }
    });
  }

  static back(delta: number = 1) {
    return uni.navigateBack({ delta });
  }

  static addSon(name: string, {
    base = "",
  }: RouterDerive = {}) {
    this.son[name] = class extends Router {
      static push(url: string, ...args: RouterPush[]) {
        super.push(base + url, ...args);
      }
    };
  }

  static dieSon(name: string) {
    delete this.son[name];
  }
}

/**
 * 路径拼接辅助函数
 * @param {string} url 路径
 * @param {Record<string, unknown> | undefined} query 参数
 * @param {boolean | undefined} allownull 是否允许为空参数
 * @param {boolean | undefined} onlyquery 是否只返回参数
 */
export function jointUrl(
  {
    url,
    query = {},
    allownull = false,
    onlyquery = false
  }: JointUrl): string {
  const fquery = [];
  const joint = /\?/.test(url as string) ? "&" : "?";
  // query 参数处理
  if (query) {
    if (query.constructor !== Object) {
      throw new TypeError("query must be an object");
    }

    for (let [key, value] of Object.entries(query)) {
      if (value && value.constructor !== String) {
        value = JSON.stringify(value);
      }
      fquery.push(key + "=" + value);
    }
  }

  if (onlyquery) {
    return fquery.join("&");
  }
  return url + joint + fquery.join("&");
}

// 格式化日期辅助函数
export function formatDate(
  date: string | Date,
  {
    pattern = "yyyy-MM-dd HH:mm:ss",
    def = "--"
  } = {}) {
  try {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    return format(date, pattern);
  } catch {
    return def;
  }
}

/**
 * 格式化换算当前时间距离指定时间多久
 * 默认换算范围为7，则在7天内的日期会返回1-7天前，小于1天则按小时算，以此内推，超过7则直接返回格式化日期
 * 详情参考https://date-fns.org/v2.16.1/docs/formatDistanceToNow
 * @param date 目标日期时间
 * @param def 目标日期时间解析失败时默认值
 * @param suffix 距离时间换算后缀，默认为前
 * @param range 需要进行换算的时间范围
 * @param pattern 日期时间格式
 * @param notSpace 是否去除空格
 */
export function formatDateDistance(date: string, {
  def = "--",
  suffix = "前",
  range = 7,
  pattern = "yyyy-MM-dd",
  notSpace = false
} = {}) {
  try {
    const target = new Date(date);
    // 只有在范围内的时间才进行距离换算
    if (compareAsc(add(target, { days: range }), new Date()) >= 0) {
      let dis = formatDistanceToNow(target, {
        locale: zhCN
      });
      // 是否去除空格
      notSpace && (dis = dis.replace(/\s+/g, ""));
      return dis + suffix;
    }
    return formatDate(date, { pattern, def });
  } catch {
    return def;
  }
}

// 二次确认提示辅助函数
export function confirmHint(
  {
    title,
    message,
    confirmBtnText = "确定",
    cancelBtnText = "取消",
    showCancel = true
  }: ConfirmHintOpts) {
  return new Promise<boolean>((resolve) => {
    uni.showModal({
      title,
      content: message,
      showCancel,
      confirmText: confirmBtnText,
      cancelText: cancelBtnText,
      // 确认取消回调
      success: ({ confirm }: { confirm: boolean }) => {
        resolve(confirm);
      },
      // 调用失败回调
      fail: () => resolve(false)
    });
  });
}

// 获取DOM元素信息集
export function getDomNodes(
  target: string, range?: unknown,
  rawopts: NodeField = {},
) {
  const opts = {
    id: true,
    dataset: true,
    ...rawopts,
  };

  return new Promise<NodeInfo>((resolve) => {
    uni
      .createSelectorQuery()
      .in(range)
      .select(target)
      .fields(opts, (node) => {
        resolve(node as NodeInfo);
      })
      .exec();
  });
}

// 获取DOM元素矩形宽高
export function getRect(target: string, range?: unknown) {
  return getDomNodes(target, range, {
    rect: true, size: true
  });
}

// 获取DOM元素滚动位置
export function getScrollOffset(target: string, range?: unknown) {
  return getDomNodes(target, range, {
    scrollOffset: true
  });
}

/**
 * 版本号权重值换算算法
 * 适用于使用该算法的版本号之间比较大小
 * @param version 需要换算成权重的版本号值
 * @param lowest 最低位数版本号，依据此标准计算
 */
export function versionWeight(version: string, lowest: number = 3): number {
  // 格式准确性验证
  if (version && !/^[\d\.vV]+$/.test(version)) {
    console.warn("xzTips: 错误的版本号格式", version);
    return 0;
  }

  // 去除版本号标识
  version = version.replace(/v/gi, "");
  let weight = 0, multiplying = 1;
  const fragments: string[] = version.split(".");

  if (lowest > fragments.length) {
    const difference = lowest - fragments.length;
    fragments.push(...(new Array(difference)).fill(0));
  }
  fragments.reverse();

  for (const i of fragments) {
    if (!/^\d+$/.test(i)) {
      continue;
    }
    weight += Number(i) * multiplying;
    multiplying = multiplying * 10;
  }
  return weight;
}
