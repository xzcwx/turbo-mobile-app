<template>
  <view
    :class="{ 'signature--landscape': landscapeOpts.show }"
    class="signature">
    <view class="signature__main">
      <canvas
        :id="$state.uidCanvas"
        hidpi
        disable-scroll
        :type="nuCanvasType"
        :canvas-id="$state.uidCanvas"
        :class="{ 'signature__canvas--disabled': $props.disabled }"
        class="signature__canvas"
        @touchstart="drawEvent($event, true)"
        @touchmove="drawEvent"
        @touchend="drawEndEvent" />
      <!-- 内容占位 -->
      <view
        v-if="placeholderCtx.show"
        class="signature__placeholder">
        <slot name="placeholder">
          <text>{{ placeholderCtx.text }}</text>
        </slot>
      </view>
    </view>
    <view class="signature__operation">
      <view class="signature__tip">
        <slot name="tip">
          <text v-if="tipCtx.show">{{ $props.tip }}</text>
        </slot>
      </view>
      <view
        v-if="operationCtx.show"
        class="signature__btn-container">
        <button
          v-if="operationCtx.clear"
          size="mini"
          class="signature__btn"
          :disabled="$props.disabled"
          @click.stop="clearEvent">
          {{ $props.cancelText }}
        </button>
        <button
          v-if="operationCtx.save"
          size="mini"
          type="primary"
          class="signature__btn"
          :disabled="$props.disabled"
          @click.stop="saveEvent">
          {{ $props.confirmText }}
        </button>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: signature
   * 组件用途: 签名组件（只用于签名）
   * 创建日期: 2023/5/26
   * 编写者: XianZhe
   */
  import { signatureProps, signatureEmits } from "./helper/props";
  import { useSignature } from "./hook/signature";

  const $props = defineProps(signatureProps);
  const $emits = defineEmits(signatureEmits);
  const {
    $state,
    landscapeOpts,
    clearEvent,
    drawEvent,
    drawEndEvent,
    saveEvent,
    tipCtx,
    placeholderCtx,
    operationCtx,
    nuCanvasType
  } = useSignature($props, $emits);

  defineExpose({
    saveEvent,
    clearEvent
  });

</script>

<style lang="scss" scoped>
  @import "./scss/signature.scss";

  .signature {
    position: relative;
    z-index: v-bind("$props.zIndex");
    width: v-bind("$props.width");

    &__main {
      height: v-bind("$props.height");
    }

    &__canvas {
      background-color: v-bind("$props.bgc");
    }

    &__tip {
      color: v-bind("$props.tipColor")
    }

    &__placeholder {
      z-index: v-bind("placeholderCtx.zindex");
    }
  }
</style>
