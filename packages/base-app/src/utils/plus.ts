/**
 * HTML5Plus相关API
 */

export type AppPlatform = "weixin" | "qq" | "sinaweibo" | "google" | "facebook";

export type AppShare = PlusShareShareService & {
  launchMiniProgram(
    options: PlusShareWeixinMiniProgramOptions,
    succeed: (res: any) => void,
    err: (res: any) => void
  ): void;
};

export function errorHandler(
  code: number | string, msg?: string,
  ignore = false
) {
  if (ignore) {
    return;
  }
  if (code === -8) {
    msg = "xzTips：非真机环境下，不存在微信客户端软件";
  }

  console["error"](`xzTips：${msg}`);
  uni.showToast({
    title: msg,
    icon: "none"
  });
}

/**
 * 获取APP服务
 * @param {keyof Plus} cate 目标服务类型
 * @param {AppPlatform} platform 服务平台
 * @return {Promise<T & {id: string}>}
 */
export async function getAppServices<T>(
  cate: keyof Plus,
  platform: AppPlatform
) {
  const services =
    (await new Promise<(T & { id: string })[]>((resolve, reject) => {
      const api = plus[cate];

      if ("getServices" in api) {
        api.getServices((services) => {
          return resolve(services as unknown as (T & { id: string })[]);
        });
      }
    })) ?? [];
  return services?.find((item) => item.id === platform);
}

// 获取认证授权服务
export function getAppOauth(platform: AppPlatform) {
  return getAppServices<PlusOauthAuthService>("oauth", platform);
}

// 获取分享服务
export function getAppShare(platform: AppPlatform) {
  return getAppServices<AppShare>("share", platform);
}

/**
 * APP IO文件系统
 */
export class IO {
  static async resolveLocalFileSystemURL(path: string) {
    return await new Promise((resolve, reject) => {
      plus.io.resolveLocalFileSystemURL(
        path,
        (entry) => resolve(entry),
        (err) => {
          errorHandler(err);
          reject(err);
        }
      );
    });
  }

  static async getFile(path: string): Promise<PlusIoFile | undefined> {
    const entry = await this.resolveLocalFileSystemURL(path);

    if (!entry) {
      return;
    }
    return await new Promise((resolve, reject) => {
      (entry as PlusIoFileEntry).file(
        (result) => resolve(result),
        (result) => {
          errorHandler(result);
          reject(result);
        }
      );
    });
  }

  /**
   * 文件系统中的读取对象
   * @type {any}
   */
  static reader = class {
    private readonly file: PlusIoFile;
    private fileReader = new plus.io.FileReader!();

    constructor(file: PlusIoFile) {
      this.file = file;
    }

    get result(): Promise<string | undefined> {
      return new Promise((resolve, reject) => {
        this.fileReader.onloadend = (e) => {
          const { target } = e as { target: PlusIoDirectoryEntry & { result?: string } };
          resolve(target.result);
        };
      });
    }

    /**
     * 将文件内容读取为浏览器能够直接引用的URL字符串
     * 图片文件将转换为BASE64类型
     * @param {string} encoding
     * @return {Promise<string | undefined>}
     */
    async readAsDataURL(encoding = "utf-8") {
      this.fileReader.readAsDataURL(this.file, encoding);

      return await this.result;
    }

    /**
     * 将文件内容读取为文本字符串
     * @param {string} encoding 读取编码
     * @return {Promise<string | undefined>} 文件内容
     */
    async readAsText(encoding = "utf-8") {
      this.fileReader.readAsText(this.file, encoding);

      return await this.result;
    }
  };
}
