<script setup lang="ts">
  /*
   * 组件名: index
   * 组件用途: XXX
   * 创建日期: 2024/5/6
   * 编写者: XianZhe
   */
  import { onLoad, onShow } from "@dcloudio/uni-app";
  import {
    computed,
    reactive,
    onMounted,
    type PropType,
    type ComponentPublicInstance
  } from "vue";

  type RefComponent = Record<string, ComponentPublicInstance<Record<string, any>> | null>;

  const $refs: RefComponent = reactive({});
  const $props = defineProps({});
  const $state = reactive({});
  const $emits = defineEmits([]);

  async function exec() {
  }

  onMounted(() => {
    exec();
  });

  onShow(() => {
  });

  onLoad(() => {
  });
</script>

<template>
  <view class="index">

  </view>
</template>

<style lang="scss" scoped>
  .index {}

</style>
