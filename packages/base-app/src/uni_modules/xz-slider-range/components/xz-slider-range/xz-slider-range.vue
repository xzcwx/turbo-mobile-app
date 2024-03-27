<template>
  <view :class="{ 'slider-range--disabled': $props.disabled }"
        class="slider-range">
    <view class="slider-range__inner">
      <!-- 滑动条 -->
      <view class="slider-range__bar">
        <view :style="{ backgroundColor: $props.bgc }" class="slider-range__bar-bg" />
        <view :style="sliderRangeStyle.activeBarStyle" class="slider-range__bar-active" />
      </view>
      <view v-for="(item, index) in sliderBlockCtx.blocks" :key="index"
            class="slider-range__controls"
            :style="item.style">
        <!-- 滑块值提示 -->
        <view v-if="item.showHint" class="slider-range__hint">{{ item.hint }}</view>
        <!-- 滑块 -->
        <view :class="{'slider-range__block--decoration': sliderBlockCtx.decoration}"
              class="slider-range__block"
              @touchmove="blockEvent($event, index)" />
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: slider-range
   * 组件用途: 范围滑块组件
   * 创建日期: 2023/5/18
   * 编写者: XianZhe
   */
  import { silderRangeProps, silderRangeEmits } from "./helper/props";
  import { useSliderRange } from "./hook/slider-range";

  const $props = defineProps(silderRangeProps);
  const $emits = defineEmits(silderRangeEmits);
  const {
    sliderRangeStyle,
    sliderBlockCtx,
    blockEvent,
    reset
  } = useSliderRange($props, $emits);

  defineExpose({
    reset
  });

</script>

<style lang="scss" scoped>
  @import "./scss/slider-range";

  .slider-range {
    padding: 0 v-bind("sliderRangeStyle.barPadding");

    &__bar {
      height: v-bind("$props.height");

      &-active {
        background-color: v-bind("$props.activeBgc");
      }
    }

    &__block {
      width: v-bind("sliderRangeStyle.blockSize");
      height: v-bind("sliderRangeStyle.blockSize");
      background-color: v-bind("$props.color");
    }

    &__hint {
      top: v-bind("$props.hintDistance");
      font-size: v-bind("$props.hintSize");
      color: v-bind("$props.hintColor");
    }
  }

</style>
