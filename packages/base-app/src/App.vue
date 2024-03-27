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

  async function exec() {
  }
</script>

<style lang="scss" src="./scss/common.scss" />
