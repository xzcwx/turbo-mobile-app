import {
  unref,
  computed,
  getCurrentInstance,
  onBeforeMount,
  onMounted,
  onUnmounted,
  reactive, watchEffect
} from "vue";
import type { ComponentInternalInstance } from "vue";

import { DrawSignature, DrawSignature2D, dpr } from "../helper/signature";
import type { SignatureProps } from "../helper/props";
import type { UniTouchEvent } from "../types";


interface State {
  [state: string]: unknown;

  uidCanvas?: string;
  emptyCanvas?: boolean;
}

export function useSignature(
  $props: SignatureProps,
  $emits: (event: string, ...args: unknown[]) => void) {
  // @ts-ignore
  const $refs: { self: ComponentInternalInstance } = reactive({
    self: getCurrentInstance()
  });
  const $state: State = reactive({
    uidCanvas: `signature-${Math.trunc(Math.random() * 1000000)}`,
    emptyCanvas: true
  });
  const landscapeOpts = reactive({
    show: false
  });

  // 签名绘制实例
  let signature: DrawSignature2D | DrawSignature;

  // 强制标准文件类型
  const nuFileType = computed<"png" | "jepg">(() => {
    if (/^(png|jepg)$/.test($props.fileType)) {
      return $props.fileType;
    }
    console.warn(`不支持${$props.fileType}文件类型`);
    return "png";
  });

  const nuCanvasType = computed(() => {
    let type = "";

    switch ($props.type) {
      case "native":
        break;
      case "2d":
        // #ifndef MP-WEIXIN || MP-KUAISHOU || MP-JD
        console.warn("xzTips: 仅在微信、京东、快手小程序支持2D签名，其余平台请使用auto或native类型");
        // #endif
        type = $props.type;
        break;
      default:
        // #ifdef MP-WEIXIN || MP-KUAISHOU || MP-JD
        type = "2d";
      // #endif
    }
    return type;
  });

  // 提示上下文
  const tipCtx = computed<{ show: boolean }>(() => {
    return {
      show: !!($props.landscape ? landscapeOpts.show && $props.tip : $props.tip)
    };
  });

  // 占位符上下文
  const placeholderCtx = computed<
    { text: string; zindex: number; show: boolean }
  >(() => {
    let text = $props.placeholder;
    if (landscapeOpts.show) {
      text = $props.placeholderLandscape;
    }
    return {
      text,
      zindex: Number($props.zIndex) + 1,
      show: !!$state.emptyCanvas && !$props.disabled
    };
  });

  // 操作上下文控制
  const operationCtx = computed(() => {
    const context = {
      save: $props.showSaveBtn,
      clear: $props.showClearBtn,
      show: $props.showSaveBtn || $props.showClearBtn
    };
    if ($props.landscape && !landscapeOpts.show) {
      Object.assign(context, { show: false });
    }
    return context;
  });

  // 横竖屏切换
  async function overturnSwitch(base64: string, direction?: "left" | "right") {
    await signature.clear();
    await signature.reset();
    // 空值且开启真实背景
    if (!$props.modelValue && $props.realBgc) {
      await signature.drawBgc($props.bgc);
    }
    await signature.drawImage(base64, direction);
  }

  function drawEvent(e: UniTouchEvent, isstart: boolean) {
    // 禁用状态
    if ($props.disabled) {
      return;
    }
    // 开启横屏且画布转换
    if ($props.landscape && !landscapeOpts.show) {
      uni.showLoading({ title: "请稍等~", mask: true });
      landscapeOpts.show = true;
      overturnSwitch($props.modelValue as string, "right");

      uni.hideLoading();
      $emits("landscape", landscapeOpts.show);
      return;
    }

    const { x, y } = e?.touches?.[e.touches.length - 1];
    $state.emptyCanvas = false;
    signature.execute(x, y);

    if (isstart) {
      return $emits("start", e);
    }
    $emits("signing", e);
  }

  function drawEndEvent(e: UniTouchEvent) {
    signature.reset(true);
    $emits("end", e);
  }

  async function saveEvent() {
    await uni.showLoading({ title: "正在保存中~", mask: true });
    if ($props.landscape) {
      // 横屏画布base64
      const lbase64 = await signature.save();
      landscapeOpts.show = false;
      $emits("landscape", landscapeOpts.show);
      await overturnSwitch(lbase64, "left");
    }
    // 竖屏画布base64
    const base64 = await signature.save();
    uni.hideLoading();

    $emits("save", base64);
    $emits("update:modelValue", base64);
  }

  function clearEvent() {
    signature.clear();
    $emits("clear");
  }

  function execute() {
    // 初始化真实背景色
    $props.realBgc && signature.drawBgc($props.bgc);

    watchEffect(async () => {
      // 主动抛出不作为画布绘入
      if (!$props.modelValue || signature.saveOutStatus) {
        return;
      }
      // #ifdef APP-PLUS
      if ($state.emptyCanvas) {
        await (new Promise((resolve => setTimeout(resolve, 100))));
      }
      // #endif
      $state.emptyCanvas = false;
      // 画布绘入
      await signature.drawImage($props.modelValue);
    });
  }

  function __init__() {
    const conf = () => ({
      self: $refs.self,
      uidCanvas: $state.uidCanvas!,
      fileType: nuFileType.value,
      hd: $props.hd,
      style: {
        penColor: $props.penColor,
        lineWidth: Number($props.lineWidth)
      }
    });

    // 绘制实例
    switch (unref(nuCanvasType)) {
      case "2d":
        signature = new DrawSignature2D(conf);
        console.log("xzTips: canvas使用2d模式");
        break;
      default:
        signature = new DrawSignature(conf);
        console.log("xzTips: canvas使用原生模式");
    }
  }

  onBeforeMount(() => {
    console?.groupCollapsed?.("xzTip: signature获取实例", (new Date()).toDateString());
    __init__ && __init__();
  });

  onMounted(() => {
    execute();

    console?.groupEnd?.();
  });

  onUnmounted(() => {
    signature?.killTemp();
  });

  return {
    $refs, $state, landscapeOpts, nuCanvasType,
    tipCtx,
    placeholderCtx,
    operationCtx,
    drawEvent,
    drawEndEvent,
    saveEvent,
    clearEvent
  };
}
