import { defineStore } from "pinia";
import { reactive, computed } from "vue";

export const useAccount = defineStore("account", () => {
  const $state = reactive({
    NAME: "USER_INFO",
    source: { token: 1234 } as UnknownObject,
    token: ""
  });

  const userInfo = computed(() => {
    return $state.source;
  });

  const token = computed(() => {
    return $state.token;
  });

  function isLogin() {
    return false;
  }

  function setUserInfo(val: UnknownObject) {
    $state.source = val;
    uni.setStorageSync($state.NAME, val);
  }

  function removeUserInfo() {
    $state.source = {};
    uni.removeStorageSync($state.NAME);
  }

  function initUserInfo() {
    Object.assign($state.source, uni.getStorageSync($state.NAME) ?? {});
    uni.setStorageSync($state.NAME, $state.source);
  }

  function setToken(text: string) {
    $state.token = text;
  }

  return {
    $state,
    userInfo,
    token,
    setUserInfo,
    setToken,
    initUserInfo,
    isLogin
  };
});
