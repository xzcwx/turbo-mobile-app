<template>
  <view class="upload-form">

  </view>
</template>

<script lang="ts" setup>
  /*
   * 组件名: upload-form
   * 组件用途: XXX
   * 创建日期: 2023/12/1
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

  type RefComponent = Record<string, ComponentPublicInstance<Record<string, any>>>;

  const $refs: RefComponent = reactive({});
  const $props = defineProps({});
  const $state = reactive({});
  const $emits = defineEmits([]);


  function execute() {
  }

  onMounted(() => {
    execute();
  });

  onShow(() => {
  });

  onLoad(() => {
  });
</script>

<style lang="scss" scoped>
  .upload-form {
  }

</style>
