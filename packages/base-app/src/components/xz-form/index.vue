<template>
  <view class="xz-form">

  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: index
   * 组件用途: XXX
   * 创建日期: 2023/11/29
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

  import { makeRequiredProp, makeArrayProp, makeObjectProp } from "@/utils/props";

  type RefComponent = Record<string, ComponentPublicInstance<Record<string, any>>>;

  const $refs: RefComponent = reactive({});
  const $props = defineProps({
    modelValue: makeRequiredProp(Object),
    options: makeRequiredProp(Array)
  });
  const $state = reactive({});
  const $emits = defineEmits(["update:modelValue"]);


  function execute() {
  }

  onMounted(() => {
    execute();
  });
</script>

<style lang="scss" scoped>
  .xz-form {
  }

</style>
