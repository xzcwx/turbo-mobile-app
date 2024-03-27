# xz-signature

[toc]

---

## 一、使用说明

xz-signature  是基于 uniapp 框架的一款签名功能组件，组件干练简洁易用，只专注于移动端签名功能。

支持 easycom 导入，允许不导入组件直接使用。目前基于TS编写，暂未分离TS语法，需要项目支持TS依赖使用。

**特点：**

- 简单易用，仅需一个 `v-model` 属性即可实现主要功能。
- 自定义程度高，可根据具体需求，自定义 UI、内容。
- 画布签名均以 base64 转码输入输出，支持将已有签名回显嵌入画布内。。
- 单组件下载版本无需第三方依赖，开箱直用，若需要使用多个该系列组件，建议使用体积更小的完整组件包。

> 注意：组件属于首发测试阶段，使用过程中遇到问题或有建议的话请提交 [Issues · xzcwx/xz-easy-uni (github.com)](https://github.com/xzcwx/xz-easy-uni/issues)，感谢您的配合❤。



---

## 二、使用示例

### 1)、基本使用

```vue
<template>
    <view class="signature">
        <view class="signature-label">申请人签名</view>
        <xz-signature @save="signatureEvent" />
    </view>
</template>

<script lang="ts" setup>
    import { computed, reactive, onMounted } from "vue";

    const formOpts = reactive({
        model: {
            signature: ""
        }
    });

    function signatureEvent(base64: string) {
        formOpts.model.signature = base64;
    }
</script>
```



### 2)、搭配 v-model 使用

`v-model` 支持将已有的签名嵌入进画布中，注意签名必须是经过 base64 编码的图片，同时在点击保存后将同步新签名。

**如果需要保存已有签名且禁用画布，请将 `v-model` 与 `disable` 属性搭配使用。**

```vue
<template>
    <view class="signature">
        <view class="signature-label">申请人签名</view>
        <xz-signature landscape v-model="formOpts.model.signature" />
    </view>
</template>

<script lang="ts" setup>
    import { computed, reactive, onMounted } from "vue";

    const formOpts = reactive({
        model: {
            signature: "data:image/png;base64,............."
        }
    });
</script>
```

### 3)、手动保存与清空

正常情况下需要用户点击保存按钮的同时，base64 值才会通过组件往外抛出，若需要通过程序实现提交、定时、退出时自动保存这些操作的话，请使用组件方法。

```vue
<template>
    <view class="signature-1">
        <view class="signature-label">申请人签名</view>
        <xz-signature v-model="formOpts.model.signature1" 
                      :show-save-btn="false"
                      :show-clear-btn="false" />
    </view>
    <view class="signature-2">
        <view class="signature-label">处理人签名</view>
        <xz-signature v-model="formOpts.model.signature2"                         						  :show-save-btn="false"
                      :show-clear-btn="false" />
    </view>

	<button @click="submitEvent">提交</button>
</template>

<script lang="ts" setup>
    import { 
        computed, reactive, onMounted,
        type ComponentPublicInstance
    } from "vue";

    const $refs: Record<string, ComponentPublicInstance<any>> = reactive({
        signature1: null,
		signature2: null,
    });
    const formOpts = reactive({
        model: {
            signature1: "data:image/png;base64,.............",
			signature2: "data:image/png;base64,............."
        }
    });
    
    function submitEvent() {
        $refs.signature1?.saveEvent();
 		$refs.signature2?.saveEvent();
    }
</script>
```



---

## 三、组件Props属性

|         属性名         |   类型    |    默认值     |    说明    |
|:-------------------:|:-------:|:----------:|:--------:|
| modelValue(v-model) | string  |    `""`    |    Base64 图片值    |
|   bgc   | string  | `#F0F0F0`  |  画布背景颜色  |
| **realBgc** | boolean | `false` | 是否为真实背景色，将随着签名一起生成，默认为透明通道图片 |
| cancelText | string  |   `"清空"`   |  取消按钮文案  |
|     confirmText     | string  |   `"保存"`   |  确定按钮文案  |
|      disabled       | boolean |  `false`   |   是否禁用   |
|      fileType       | `"png"  |  "jepg"`   | `"png"`  | 文件类型 |
|        width        | string  |  `"100%"`  |   画布宽度   |
|       height        | string  | `"200px"`  |   画布高度   |
| hd | boolean | `true` | 是否启用高清模式 |
|      lineWidth      | number  |    `5`     | 画笔宽度（大小） |
| landscape | boolean | `false` | 是否启用横屏 |
|      penColor       | string  |   `#000`   |   画笔颜色   |
|     placeholder     | string  | `"滑动此处签名"` |  签名占位内容  |
| placeholderLandscape | string | `"点击进入签名"` | 横屏签名占位提示 |
| type | `"auto" | "native" | "2d"` | `auto` | 画布模式类型，仅小程序支持2d模式 |
|         tip         | string |    `""`    |  签名提示贴士  |
| tipColor | string | `#9D9D9D` | 签名提示贴士颜色 |
| showClearBtn | boolean | `true` | 是否显示清除按钮 |
| showSaveBtn | boolean | `true` | 是否显示保存按钮 |
|       zIndex        | number  |    `9`    |  画布优先层级  |



---

## 四、组件Events

|  事件名   |              参数              |      说明      |
| :-------: | :----------------------------: | :------------: |
|   save    |    (base64: string) => void    |  保存画布触发  |
|   clear   |           () => void           |   清空画触发   |
|   start   |       (e: Event) => void       |  开始绘画触发  |
|    end    |       (e: Event) => void       |  结束绘画触发  |
|  signing  |       (e: Event) => void       | 绘画过程中触发 |
| landscape | (isLandscape: boolean) => void | 切换横竖屏触发 |



---

## 五、组件Slots

|   插槽名    | 作用域 |     说明     |
| :---------: | :----: | :----------: |
| placeholder |  `{}`  | 签名占位内容 |
|     tip     |  `{}`  | 签名提示贴士 |



---

## 六、组件方法

|   方法名   |    类型    |                           说明                            |
| :--------: | :--------: | :-------------------------------------------------------: |
| saveEvent  | () => void | 保存当前画布内容并触发 `update:modelValue` 与 `save` 事件 |
| clearEvent | () => void |        清空当前画布内容，并触发 `clearEvent` 事件         |



---

## 七、注意事项

- <font color=bold>微信小程序 2d 画布模式下，微信开发者工具老版本可能存在一些显示上的错误，如画布优先级覆盖、占位符不显示等，这些在真机上都是不存在的，**开发时请以真机为准**！</font>



---

## 便捷导航

- 作者博客地址：https://blog.csdn.net/XianZhe_
- 项目仓库地址：[xzcwx/xz-easy-uni: 致力于简单易用的 UniApp ui库。 (github.com)](https://github.com/xzcwx/xz-easy-uni)
