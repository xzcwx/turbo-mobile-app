import {
  computed, reactive, onMounted,
  toRaw, getCurrentInstance
} from "vue";
import type { SilderRangeProps } from "../helper/props";
import type { SliderBlockCtx } from "../types";

export interface NodeInfo extends UniNamespace.NodeInfo {
  width: number;
  height: number;
}

// 获取DOM元素矩形宽高
export function getRect(target: string, range?: unknown) {
  return new Promise<NodeInfo>((resolve) => {
    uni
      .createSelectorQuery()
      .in(range)
      .select(target)
      .boundingClientRect((size) => {
        resolve(size as NodeInfo);
      })
      .exec();
  });
}

export function useSliderRange(
  $props: SilderRangeProps,
  $emits: (event: string, ...args: unknown[]) => void) {
  const $refs = reactive({
    self: getCurrentInstance()
  });
  const $state = reactive({
    values: [$props.min, $props.max],
    rect: {} as NodeInfo
  });

  const sliderBlockCtx = computed<SliderBlockCtx>(() => {
    const [lower, higher] = $state.values;
    const lp = getPercent(lower, $props.min);
    const rp = getPercent(higher, $props.min);

    let lhint: string | number = lower, rhint: string | number = higher;
    // 自定义格式化
    if ($props.format && $props.format instanceof Function) {
      lhint = $props.format(lhint);
      rhint = $props.format(rhint);
    }

    const blocks: SliderBlockCtx["blocks"] = [{
      hint: lhint,
      showHint: true,
      style: { left: lp + "%" }
    }];
    if (!$props.solo) {
      blocks.push({
        hint: rhint,
        showHint: rp - lp > $props.hintSafeOverlap,
        style: { left: rp + "%" }
      });
    }

    return { blocks, decoration: $props.decoration };
  });

  const sliderRangeStyle = computed(() => {
    const [lower, higher] = $state.values;
    const barPadding = $props.size / 2 + "px";
    let activeBarStyle = {
      width: getPercent(higher, lower) + "%",
      left: getPercent(lower, $props.min) + "%"
    };

    if ($props.solo) {
      activeBarStyle = {
        width: lower + "%",
        left: "0%"
      };
    }

    return {
      barPadding, activeBarStyle,
      blockSize: $props.size + "px"
    };
  });

  function blockEvent(e: TouchEvent, index: number) {
    const { pageX } = e?.touches?.[e?.touches.length - 1];
    const { left, width } = $state.rect;

    if (left && width) {
      const target = Math.round(getPercent(pageX, left, width))
        * (($props.max - $props.min) / 100)
        * (1 + $props.rate * 0.1) + $props.min;

      switch (true) {
        // 高值不低于底值限制
        case index !== 0 && target <= $state.values[0]:
          break;
        // 低值不高于高值限制
        case index === 0 && target >= ($state.values[1] ?? $props.max):
          break;
        // 过大处理
        case pageX >= left + width:
          $state.values[index] = $props.max;
          break;
        case pageX >= left:
          $state.values[index] = target;
      }

      const extract = $state.values.slice(0, $props.solo ? 1 : $state.values.length);
      $emits("update:modelValue", extract);
      $emits("change", toRaw(extract));
    }
  }

  function getPercent(
    higher: number, lower: number = 0,
    total = $props.max - $props.min
  ) {
    return (higher - lower) / total * 100;
  }

  function reset() {
    $state.values = [$props.min, $props.max];
  }

  async function execute() {
    $state.rect = await getRect(".slider-range__inner", $refs.self);

    if ($props.modelValue && Array.isArray($props.modelValue) && $props.modelValue.length >= 2) {
      $state.values = $props.modelValue;
    }
    $emits("update:modelValue", $state.values);
  }

  onMounted(execute);

  return {
    $state, sliderRangeStyle,
    sliderBlockCtx, blockEvent, reset
  };
}
