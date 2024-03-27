/**
 * 画布组件程序辅助
 */
// #ifdef APP-PLUS
import { IO } from "../utils/plus";
// #endif
import type {
  CanvasType,
  UniCanvasContext2D,
  UniCanvasContext,
  UniCanvasElement,
  SignatureConfs,
  DrawImage,
  SignatureCanvasCtx
} from "../types";

export const dpr = getDpr();

// #ifdef MP
export const fs: UniNamespace.FileSystemManager = uni.getFileSystemManager();

// #endif

export abstract class AbstractSignature {
  // 源数据参数获取回调
  protected _rawprops?: () => SignatureConfs;
  // 画布布局位置单例
  protected _bounding: UniNamespace.NodeInfo | null = null;
  // 是否为保存输出
  protected _saveOutStatus = false;
  // 防抖
  protected _beginTime: null | number = null;
  // canvas画布元素实例
  protected canvas?: UniCanvasElement;
  // 指针存储
  prev: number[] = [];
  curr: number[] = [];
  // 嵌入图片路径
  implantImgPath = "";

  protected constructor(props: () => SignatureConfs) {
    if (this.constructor === AbstractSignature) {
      throw new TypeError("❗❗不允许实例化AbstractSignature抽象类❗❗");
    }

    this._rawprops = props;
  }

  get props(): SignatureConfs {
    return this._rawprops!();
  }

  get styles(): Required<SignatureConfs>["style"] {
    return this.props.style ?? {};
  }

  // 获取画布实例
  get ctx(): SignatureCanvasCtx {
    return uni.createCanvasContext(this.props?.uidCanvas as string, this.props?.self);
  }

  get saveOutStatus() {
    const status = this._saveOutStatus;
    this._saveOutStatus = false;
    return status;
  }

  get bounding() {
    if (!this._bounding) {
      return this.getBounding(true);
    }
    return this._bounding;
  }

  async getBounding(inplace = false) {
    const selector = uni.createSelectorQuery().in(this.props.self);
    const bounding = await (new Promise<UniNamespace.NodeInfo>((resolve) => {
      selector
        .select(`#${this.props.uidCanvas}`)
        .boundingClientRect((data) => {
          resolve(data as UniNamespace.NodeInfo ?? {});
        })
        .exec();
    }));

    inplace && (this._bounding = bounding);
    return bounding;
  }

  /**
   * 重置内部缓存
   * - 重新获取Canvas宽高
   * - 销毁缓存变量
   * @param {boolean} easy 是否为简单重置
   */
  async reset(easy = false) {
    this._beginTime = null;
    this.prev = [];
    this.curr = [];
    await this.getBounding(true);
  }

  /**
   * 设置指针
   * @param {number} x x轴坐标
   * @param {number} y y轴坐标
   */
  setPointer(x: number, y: number) {
    this.prev = this.curr;
    this.curr = [x, y];
    if (this.prev?.length <= 0) {
      this.prev = this.curr;
    }
  }

  /**
   * 设置画笔样式
   * @param {UniCanvasContext} ctx canvas上下文
   * @param type
   * @param style
   */
  setPenStyle(
    ctx: UniCanvasContext | UniCanvasContext2D,
    type: CanvasType = "native",
    style?: Record<string, unknown>
  ) {
    const { lineWidth, penColor, fillStyle } = style ?? this.styles;
    // 2d样式
    if (/^2d$/i.test(type)) {
      ctx.lineCap = "round";
      Object.assign(ctx, { lineWidth, fillStyle: penColor ?? fillStyle });
      return;
    }
    (ctx as UniCanvasContext).setLineCap("round");
    lineWidth && (ctx as UniCanvasContext).setLineWidth(lineWidth as number);
    penColor && (ctx as UniCanvasContext).setFillStyle((penColor ?? fillStyle) as string);
  }

  /* ---------------------------------------------------------------- */

  draw() {}

  drawImage(resource: DrawImage.resource, direction?: DrawImage.direction) {}

  async rotate(
    direction: DrawImage.direction,
    origin: DrawImage.origin = [0, 0]
  ) {
    const ctx = await this.ctx;
    const angle = (90 * Math.PI) / 180;
    const [centreX, centreY] = origin;
    // #ifdef APP-PLUS
    await (new Promise(resolve => setTimeout(resolve, 100)));
    // #endif

    // 原点定位
    ctx.translate(centreX, centreY);
    switch (direction) {
      case "left":
        ctx.rotate(-angle);
        break;
      case "right":
        ctx.rotate(angle);
        break;
      default:
        ctx.rotate((90 * Math.PI) / direction);
    }
  }

  /**
   * 保存画布
   * @return {Promise<string>} base64字符集
   */
  save(type: CanvasType = "native", wh?: [number, number]): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const opts = {
        canvasId: this.props.uidCanvas.toString(),
        fileType: this.props.fileType as string,
        // 图片质量
        quality: this.props.hd ? 0 : 1,
        success: async ({ tempFilePath }: { tempFilePath: string }) => {
          // #ifdef H5
          this._saveOutStatus = true;
          resolve(tempFilePath);
          // #endif
          // #ifdef APP-PLUS
          const file = await IO.getFile(tempFilePath);
          if (file) {
            const reader = new IO.reader(file);
            this._saveOutStatus = true;
            resolve(await reader.readAsDataURL() as string);
          }
          reject("xzTips: file is empty");
          // #endif
          // #ifdef MP
          fs.readFile({
            filePath: tempFilePath,
            encoding: "base64",
            success: ({ data }) => {
              this._saveOutStatus = true;
              resolve(base64Handler(data as string, this.props.fileType as string));
            },
            fail: ({ errMsg }) => reject(errMsg)
          });
          // #endif
        },
        fail: (err: string) => reject(err)
      };

      // 指定宽高
      if (Array.isArray(wh) && wh.length > 0) {
        const [width, height] = wh;
        Object.assign(opts, { width, height });
      }

      // 2d与webgl模式
      if (/^(2d|webgl)$/i.test(type)) {
        Object.assign(opts, { canvas: this.canvas });
      }
      uni.canvasToTempFilePath(opts, this.props.self);
    });
  }

  async drawTask(
    exec: (
      ctx: UniCanvasContext | UniCanvasContext2D,
      width: number,
      height: number
    ) => void,
    defaultwh: number = 1000
  ) {
    const ctx = await this.ctx;
    const { width = defaultwh, height = defaultwh } = await this.bounding;

    exec(ctx, width, height);
    "draw" in ctx && ctx.draw?.();
  }

  /**
   * 清空画布
   * ❗ 这是一个异步操作，需要获取画布宽高
   * @param {number} offset 偏差
   */
  clear(offset = 10) {
    this.drawTask((ctx, width, height) => {
      ctx.clearRect(0, 0, width + offset, height + offset);
    });
  }

  async drawBgc(bgc: string, offset = 10, type: CanvasType = "native") {
    this.drawTask((ctx, width, height) => {
      this.setPenStyle(ctx, type, { fillStyle: bgc });
      ctx.fillRect(0, 0, width + offset, height + offset);
      // 恢复默认画笔样式
      this.setPenStyle(ctx, type);
    });
  }

  /* ---------------------------------------------------------------- */

  /**
   * 将base64转存本地文件
   * @param {DrawImage.resource} resource 资源
   * @return {Promise<boolean>} 存储状态
   */
  async base64ToLocal(resource: DrawImage.resource) {
    if (!resource) {
      return false;
    }
    // 只允许base64绘制
    if (!/^data:.+;base64,/.test(resource)) {
      console.warn("This signature canvas allows base64 drawing only");
      return false;
    }
    const suffix = /^data:.+\/(?<suffix>\w+);/.exec(resource)?.groups?.suffix;

    this.killTemp();
    this.implantImgPath =
      (uni as Uni & { env: { USER_DATA_PATH: string } })?.env?.USER_DATA_PATH +
      `/${new Date().getTime()}.` +
      suffix ?? "png";
    // 写入本地文件处理
    await writeFile(resource, this.implantImgPath);
    return true;
  }

  /**
   * 清除缓存
   * ❗ 对于性能来说这很重要
   */
  killTemp() {
    // #ifdef APP-PLUS
    try {
      this.implantImgPath && fs.unlinkSync(this.implantImgPath);
    } catch {}
    // #endif
  }

  execute(x: number, y: number) {
    const _endTime = new Date().getTime();
    if (this._beginTime && _endTime - this._beginTime < 10) {
      return;
    }
    this._beginTime = _endTime;

    this.setPointer(x, y);
    this.draw();
  }
}

/**
 * 原生画布类型(旧接口)
 */
export class DrawSignature extends AbstractSignature {
  private _ctx?: UniCanvasContext;

  constructor(props: () => SignatureConfs) {
    super(props);
  }

  get ctx(): UniCanvasContext {
    if (!this._ctx) {
      return this.getcanvas(true);
    }
    return this._ctx;
  }

  getcanvas(inplace = false) {
    const ctx = super.ctx as UniCanvasContext;
    inplace && (this._ctx = ctx);
    return ctx;
  }

  /**
   * 绘制画布
   */
  async draw() {
    const ctx = this.ctx;
    let [x1, y1, x2, y2] = ([] as number[]).concat(this.prev, this.curr);

    ctx.beginPath();
    this.setPenStyle(ctx);
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(x1, y1, x2, y2);
    // 下笔绘图
    ctx.stroke();
    ctx.draw(true);
  }

  /**
   * 绘制图像到画布
   * @param {string} resource
   * @param direction
   * @return {Promise<void>}
   */
  async drawImage(
    resource: DrawImage.resource,
    direction?: DrawImage.direction
  ) {
    // #ifdef MP
    // 存储图片至本地
    if (!(await this.base64ToLocal(resource))) {
      return;
    }
    resource = this.implantImgPath;
    // #endif

    if (!resource) {
      return;
    }
    const ctx = this.ctx;
    const { width, height } = await this.bounding;
    const [centreX, centreY] = [width! / 2, height! / 2];

    ctx.save();
    // 写入画布处理👇
    if (direction) {
      await this.rotate(direction, [centreX, centreY]);
      ctx.drawImage(resource, -centreY, -centreX, height!, width);

    } else {
      // 常规绘制
      ctx.drawImage(resource, 0, 0, width, height);
    }
    ctx.restore();

    await (new Promise<void>((resolve) => {
      ctx.draw(false, () => resolve());
    }));
  }

  drawBgc(bgc: string, offset?: number) {
    return super.drawBgc(bgc, offset, "native");
  }
}

/**
 * 2D画布类型
 */
export class DrawSignature2D extends AbstractSignature {
  private _ctx2d?: UniCanvasContext2D;

  constructor(props: () => SignatureConfs) {
    super(props);
    this.get2dcanvas(true);
  }

  get ctx(): UniCanvasContext2D | Promise<UniCanvasContext2D> {
    if (!this._ctx2d) {
      return this.get2dcanvas(true);
    }
    return this._ctx2d;
  }

  async get2dcanvas(inplace = false) {
    const { canvas, ctx } = await new Promise<{
      canvas: UniCanvasElement;
      ctx: UniCanvasContext2D;
    }>((resolve, reject) => {
      const selector = uni.createSelectorQuery().in(this.props?.self);
      selector
        .select(`#${this.props.uidCanvas}`)
        .node(({ node } = {}) => {
          !node &&
          reject("xzTips: Failed to get the node. Please check whether the canvas element is assigned an id");

          const ctx = (node as HTMLCanvasElement).getContext("2d")! as UniCanvasContext2D;
          resolve({ canvas: node, ctx });
        })
        .exec();
    });
    const { width, height } = await this.bounding;

    this.canvas = canvas;
    inplace && (this._ctx2d = ctx);
    this.initCanvas2d(ctx, width!, height!);

    return ctx;
  }

  /**
   * 初始化处理逻辑宽高
   * @param {UniCanvasContext2D} ctx
   * @param {number} width
   * @param {number} height
   */
  initCanvas2d(ctx: UniCanvasContext2D, width: number, height: number) {
    console.log(`xzTips: width=${width}, height=${height}`);
    this.canvas!.width = width! * dpr;
    this.canvas!.height = height! * dpr;
    ctx.scale(dpr, dpr);
  }

  async reset(easy = false) {
    await super.reset(easy);

    if (easy) {
      return;
    }
    const { width, height } = await this.bounding;
    this.initCanvas2d(await this.ctx, width!, height!);
  }

  async draw() {
    const ctx = await this.ctx;
    const [x1, y1, x2, y2] = ([] as number[]).concat(this.prev, this.curr);

    ctx.beginPath();
    this.setPenStyle(ctx, "2d");
    ctx.moveTo(x1, y1);
    ctx.quadraticCurveTo(x1, y1, x2, y2);
    // 下笔绘图
    ctx.stroke();
  }

  async drawImage(resource: DrawImage.resource,
                  direction?: DrawImage.direction) {
    const ctx = await this.ctx;
    const { width, height } = await this.bounding;
    const [centreX, centreY] = [width! / 2, height! / 2];
    const image = await this.canvas!.createImage();
    // #ifdef APP-PLUS || H5
    image.src = resource ?? "";
    // #endif
    // #ifdef MP
    // 存储图片至本地
    if (!(await this.base64ToLocal(resource))) {
      return;
    }
    image.src = this.implantImgPath ?? "";
    // #endif

    await new Promise<void>((resolve) => {
      image.onload = () => resolve();
    });
    ctx.save();

    // 写入画布处理👇
    if (direction) {
      await this.rotate(direction, [centreX, centreY]);
      ctx.drawImage(image, -centreY, -centreX, height!, width!);
    } else {
      ctx.drawImage(image, 0, 0, width!, height!);
    }
    ctx.restore();
  }

  drawBgc(bgc: string, offset?: number) {
    return super.drawBgc(bgc, offset, "2d");
  }

  async save(type: CanvasType = "2d") {
    const { width, height } = await this.bounding;
    return await super.save(type, [width!, height!]);
  }
}

/**
 * WebGl画布类型
 */
// export class DrawSignatureWebGl extends DrawSignature {}

export function base64Handler(coding: string, suffix: string) {
  return `data:image/${suffix};base64,` + coding;
}

/**
 * 写入本地文件
 * @param {string} resource 资源
 * @param {string} fpath 文件路径
 * @param {UniNamespace.WriteOption["encoding"]} encoding 文件编码
 * @return {Promise<void>}
 */
export function writeFile(
  resource: string,
  fpath: string,
  encoding: UniNamespace.WriteOption["encoding"] = "base64"
) {
  // 预处理
  switch (encoding) {
    case "base64":
      resource = resource.replace(/^data.+;base64,/, "");
      break;
  }
  return new Promise<void>((resolve, reject) => {
    fs.writeFile({
      filePath: fpath,
      data: resource,
      encoding,
      success: () => resolve(),
      fail: reject
    });
  });
}

export function getDpr() {
  // 微信8.0.14版本以上可用
  if (uni.canIUse("getWindowInfo")) {
    return uni.getWindowInfo().pixelRatio;
  }
  const { pixelRatio } = uni.getSystemInfoSync();
  return pixelRatio;
}
