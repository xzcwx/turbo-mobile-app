# xz-slider-range

[toc]

---

## 一、使用说明

xz-slider-range 是基于 uniapp 框架的一款区间滑块组件，组件干练简洁易用，支持单、双区间操作。

支持 easycom 导入，允许不导入组件直接使用。目前基于TS编写，暂未分离TS语法，需要项目支持TS依赖使用。

**特点：**

- 简单易用，仅需一个 `v-model` 属性即可实现主要功能。
- 支持单、双范围灵活切换。
- 自定义程度高，可根据具体需求，自定义 UI、内容。
- 单组件下载版本无需第三方依赖，开箱直用，若需要使用多个该系列组件，建议使用体积更小的完整组件包。

>  注意：组件属于首发测试阶段，使用过程中遇到问题或有建议的话请提交 [Issues · xzcwx/xz-easy-uni (github.com)](https://github.com/xzcwx/xz-easy-uni/issues)，感谢您的配合❤。



---

## 二、使用示例

### 1)、基本使用

```vue
<template>
    <view class="slider-range">
      <view>{{ sliderRange.title }}</view>
      <xz-slider-range v-model="sliderRange.val" />
    </view>
</template>

<script lang="ts" setup>
  import { computed, reactive, onMounted } from "vue";

  const sliderRange = reactive({
    title: "基本使用",
    val: [0, 100]
  });
</script>
```



### 2)、传统单区间滑块

```vue
<template>
    <view class="slider-range">
      <view>{{ sliderRange.title }}</view>
      <xz-slider-range v-model="sliderRange.val" solo :decoration="false"/>
    </view>
</template>

<script lang="ts" setup>
  import { computed, reactive, onMounted } from "vue";

  const sliderRange = reactive({
    title: "传统单区间滑块",
    val: [0]
  });
</script>
```



### 3)、自定义区间

```vue
<template>
    <view class="slider-range">
      <view>{{ sliderRange.title }}</view>
      <xz-slider-range v-model="sliderRange.val" :min="100" :max="1000000" />
    </view>
</template>

<script lang="ts" setup>
  import { computed, reactive, onMounted } from "vue";

  const sliderRange = reactive({
    title: "自定义区间",
    val: []
  });
</script>
```



### 4)、自定义区间提示

```vue
<template>
    <view class="slider-range">
      <view>{{ sliderRange.title }}</view>
      <xz-slider-range v-model="sliderRange.val" 
                       :format="(val) => `￥${val}万`"
                       hint-color="#007979" hint-size="14px"  />
    </view>
</template>

<script lang="ts" setup>
  import { computed, reactive, onMounted } from "vue";

  const sliderRange = reactive({
    title: "自定义区间提示",
    val: []
  });
</script>
```





---

## 三、组件Props属性

| 属性名 | 类型 | 默认值 | 说明 |
| :-: | :-: | :-: | :-: |
| **modelValue** | Array<number, number> | `[min, max]` | 滑块已选中区间的值 |
| min | number | `0` | 滑块区间最小值 |
| max | number | `100` | 滑块区间最大值 |
| rate | number | `0` |               步进倍率（依据实际min和max为主）               |
| format | (val: number) => string | `undefined` |                       滑块值格式化回调                       |
| disabled | boolean | `false` | 是否为禁用状态 |
| **size** | number | `26` |                           滑块大小                           |
| color | string |    `#FFF`    |                           滑块颜色                           |
| bgc | string | `#E9E9E9` | 背景条颜色 |
| activeBgc | string | `#1AAD19` | 已选择背景条的颜色 |
| height | string | `5px` | 区间进度条高度 |
| hint | boolean | `true` | 是否显示滑块值提示文本 |
| hintSize | string | `12px` | 提示文本大小 |
| hintColor | string | `#666` | 提示文本颜色 |
| hintSafeOverlap | number | `5` | 提示重叠安全距离（百分比） |
| hintDistance | string | `-24px` | 提示距按钮距离 |
| decoration | boolean | `true` | 是否显示滑块内装饰元素 |
| **solo** | boolean | `false` | 是否为单区间模式 |


---

## 四、组件Events事件

| 事件名 |           参数            |       说明       |
| :----: | :-----------------------: | :--------------: |
| change | `(val: number[]) => void` | 滑块值更改时触发 |



---

## 五、组件方法

| 方法名 |     类型     |       说明       |
| :----: | :----------: | :--------------: |
| reset  | `() => void` | 重置滑块所选范围 |



---

## 便捷导航

- 作者博客地址：https://blog.csdn.net/XianZhe_
- 项目仓库地址：[xzcwx/xz-easy-uni: 致力于简单易用的 UniApp ui库。 (github.com)](https://github.com/xzcwx/xz-easy-uni)
