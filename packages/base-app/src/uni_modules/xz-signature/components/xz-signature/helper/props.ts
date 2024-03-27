import type { ExtractPropTypes, PropType } from "vue";
import type { CanvasType } from "../types";

const numericProp = [Number, String];

const truthProp = {
  type: Boolean,
  default: true as const
};

const lieProp = {
  type: Boolean,
  default: false as const
};

const makeNumericProp = <T>(defVal: T) => {
  return { type: numericProp, default: defVal };
};

const makeStringProp = <T>(defVal: T) => {
  return { type: String as unknown as PropType<T>, default: defVal };
};

export const signatureProps = {
  // 画布值
  modelValue: String,
  // 画布背景颜色
  bgc: makeStringProp("#FFF"),
  // 是否为真实背景色，将随着签名一起生成，默认为透明通道图片
  realBgc: lieProp,
  // 取消按钮文案
  cancelText: makeStringProp("清空"),
  // 确定按钮文案
  confirmText: makeStringProp("保存"),
  // 是否禁用
  disabled: lieProp,
  // 导出文件类型
  fileType: makeStringProp<"jepg" | "png">("png"),
  // 画布宽度
  width: makeStringProp("100%"),
  // 画布高度
  height: makeStringProp("200px"),
  // 是否启用高清
  hd: truthProp,
  // 画笔宽度（大小）
  lineWidth: makeNumericProp(5),
  // 是否启用横屏
  landscape: lieProp,
  // 画笔颜色
  penColor: makeStringProp("#555"),
  // 签名占位提示
  placeholder: makeStringProp("滑动此处签名"),
  // 横屏签名占位提示
  placeholderLandscape: makeStringProp("点击进入签名"),
  // 模式类型，默认native
  type: makeStringProp<CanvasType>("auto"),
  // 签名提示贴士
  tip: String,
  // 签名提示贴士颜色
  tipColor: makeStringProp("#9D9D9D"),
  // 是否显示清除按钮
  showClearBtn: truthProp,
  // 是否显示保存按钮
  showSaveBtn: truthProp,
  // 画布优先层级
  zIndex: makeNumericProp(9)
} as const;


export const signatureEmits = [
  "update:modelValue",
  "save",
  "clear",
  "start",
  "end",
  "signing",
  "landscape"
];

export type SignatureProps = ExtractPropTypes<typeof signatureProps>;
