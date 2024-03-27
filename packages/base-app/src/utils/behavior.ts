/**
 * uniapp 动作行为类API
 * 为实现多端兼容，请确保使用同一api处理
 */
import { type AppTarget, errorHandler, getAppShare } from "./plus";

export async function toMiniProgram(
  appid: string,
  path?: string,
  {
    ghid,
    extraData,
    target = "weixin"
  }: {
    ghid?: string;
    extraData?: UnknownObject;
    target?: AppTarget;
  } = {}
) {
  console.debuglog?.("xzTips: 小程序跳转", appid, path, ghid);
  // #ifdef MP
  uni.navigateToMiniProgram({
    appId: appid,
    path,
    extraData,
    fail: (err: string) => {
      console?.debugerror?.(err);
    }
  });
  // #endif
  // #ifdef APP-PLUS
  if (!ghid) {
    const msg = "xzTips：app端跳转需配置gh_开头的原始id";
    console?.debugerror?.(msg);
    await uni.showToast({
      title: msg,
      icon: "none",
      mask: true
    });
  }

  const share = (await getAppShare(target));
  try {
    share &&
    share.launchMiniProgram(
      {
        id: ghid,
        path
      },
      () => {},
      ({ code, message } = {}) => errorHandler(code, message)
    );
  } catch (err) {
    console?.debugerror(err);
  }
  // #endif
}
