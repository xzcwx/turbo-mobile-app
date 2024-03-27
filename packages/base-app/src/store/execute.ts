/**
 * 此 Store 存放与处理程序执行过程中的状态属性
 */

import { reactive } from "vue";
import { defineStore } from "pinia";

export const useExecuteStore = defineStore("program_execute", () => {
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

  function resetPreviewImage() {
    uniApi.previewImage = false;
  }

  function resetChooseMedia() {
    uniApi.chooseMedia = false;
  }

  return {
    uniApi,
    wxApi,
    aliApi,
    resetPreviewImage,
    resetChooseMedia
  };
});
