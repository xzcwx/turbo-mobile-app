/**
 * 此 Store 存放与处理程序执行过程中的状态属性
 */

import { computed, reactive } from "vue";
import { defineStore } from "pinia";

interface ExecuteSafeArea extends UniNamespace.SafeAreaInsets {
  topUnit: string;
  bottomUnit: string;
}

export const useExecuteStore = defineStore("program_execute", () => {
  const systemInfo: UniNamespace.GetSystemInfoResult | Object = reactive({});
  // uniapi触发状态
  const uniApi = reactive({
    // 是否开启预览图片状态
    previewImage: false,
    // 是否开启媒体文件选择状态
    chooseMedia: false
  });
  // wxApi触发状态
  const wxApi = reactive({});
  // aliApi 触发状态
  const aliApi = reactive({});
  // toutiao(抖音)Api 触发状态
  const ttApi = reactive({});

  const safeAreaInsets = computed<ExecuteSafeArea | null>(() => {
    if (!("safeAreaInsets" in systemInfo)) {
      return null;
    }
    const safeAreaInsets = (systemInfo as UniNamespace.GetSystemInfoResult).safeAreaInsets!;
    const { top, bottom } = safeAreaInsets;
    return {
      ...safeAreaInsets,
      topUnit: top + "px",
      bottomUnit: bottom + "px"
    } as ExecuteSafeArea;
  });

  function resetPreviewImage() {
    uniApi.previewImage = false;
  }

  function resetChooseMedia() {
    uniApi.chooseMedia = false;
  }

  async function setSystemInfo() {
    Object.assign(systemInfo, await (new Promise((resolve, reject) => {
      uni.getSystemInfo({
        success: resolve,
        fail: reject,
      });
    })));
  }

  function exec() {
    setSystemInfo();
  }

  return {
    exec,
    systemInfo,
    setSystemInfo,
    uniApi, wxApi,
    aliApi, ttApi,
    safeAreaInsets  ,
    resetPreviewImage,
    resetChooseMedia
  };
});
