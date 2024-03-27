/**
 * 组件属性辅助
 * 🙌 能够使用更少的代码编写，有助于减少包体积
 */
import type { PropType } from "vue";

export const unknownProp = null as unknown as PropType<unknown>;

export const numericProp = [Number, String];

export const truthProp = {
  type: Boolean,
  default: true as const
};

export const lieProp = {
  type: Boolean,
  default: false as const
};

export const makeRequiredProp = <T>(type: T) => {
  return { type, required: true as const };
};

export const makeNumericProp = <T>(defVal: T) => {
  return { type: numericProp, default: defVal };
};

export const makeStringProp = <T>(defVal: T) => {
  return { type: String as unknown as PropType<T>, default: defVal };
};

export const makeNumberProp = <T>(defVal: T) => {
  return { type: Number as unknown as PropType<T>, default: defVal };
};

export const makeArrayProp = <T>(defVal: T[]) => {
  return { type: Array as PropType<T[]>, default: () => defVal };
};

export const makeObjectProp = <T>(defVal: T) => {
  return { type: Object as PropType<T>, default: () => defVal };
};

export const makeFuncProp = <T>(defVal: T) => {
  return { type: Function as PropType<T>, default: defVal };
};

// 联和类型属性
export const makeUniteProp = <T, V>(type: T[], defVal: V) => {
  return { type, default: () => defVal };
};
