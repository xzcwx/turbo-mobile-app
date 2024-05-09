<script setup lang="ts">
  import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

  onLaunch(() => {
    console.log("App Launch");
  });
  onShow(() => {
    console.log("App Show");
  });
  onHide(() => {
    console.log("App Hide");
  });

  async function exec() {}
</script>

<style lang="scss" src="./scss/common.scss" />
<!-- 针对于某些特殊平台存在默认样式进行清除操作，一般在富文本中作用 -->
<!-- 在H5端Uniapp默认是以`* {margin: 0}`通用符进行清除，这里以更好的效果去除 -->
<!-- #ifdef MP-TOUTIAO || WEB -->
<style lang="scss" src="./scss/reset.scss" />
<!-- endif -->
