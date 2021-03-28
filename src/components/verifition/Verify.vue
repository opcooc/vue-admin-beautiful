<template>
  <div
    v-show="showBox"
    :class="mode === 'pop' ? 'mask' : ''"
    style="display: block"
  >
    <div
      :class="mode === 'pop' ? 'verifybox' : ''"
      :style="{ width: parseInt(imgSize.width) + 20 + 'px' }"
    >
      <div v-if="mode === 'pop'" class="verifybox-top">
        请完成安全验证
        <span class="verifybox-close" @click="closeBox">
          <vab-colorful-icon :icon-class="'close'" />
        </span>
      </div>
      <div class="verifybox-content">
        <!-- 验证码容器 -->
        <components
          :is="componentType"
          v-if="componentType"
          ref="instance"
          :captcha-type="captchaType"
          :type="verifyType"
          :mode="mode"
          :v-space="vSpace"
          :explain="explain"
          :img-size="imgSize"
          :block-size="blockSize"
          :bar-size="barSize"
        ></components>
      </div>
    </div>
  </div>
</template>
<script type="text/babel">
  /**
   * Verify 验证码组件
   * @description 分发验证码使用
   * */
  import VerifySlide from './Verify/VerifySlide'
  import VerifySlide2 from './Verify/VerifySlide2'
  import VerifyPoints from './Verify/VerifyPoints'

  export default {
    name: 'Vue2Verify',
    components: {
      VerifySlide,
      VerifySlide2,
      VerifyPoints,
    },
    props: {
      // 双语化
      locale: {
        require: false,
        type: String,
        default() {
          // 默认语言不输入为浏览器语言
          if (navigator.language) {
            var language = navigator.language
          } else {
            var language = navigator.browserLanguage
          }
          return language
        },
      },
      //验证码类型
      captchaType: {
        type: String,
        required: true,
      },
      //显示模式 pop:弹出式，fixed:固定
      mode: {
        type: String,
        default: 'pop',
      },
      //验证码图片和移动条容器的间隔，默认单位是px。如：间隔为10px，默认:vSpace:10
      vSpace: {
        type: Number,
        default: 10,
      },
      // 滑动条内的提示，不设置默认是：'向右滑动完成验证'
      explain: {
        type: String,
        default: '向右拖动滑块填充拼图',
      },
      //背景图片大小
      imgSize: {
        type: Object,
        default() {
          return {
            width: '280px',
            height: '140px',
          }
        },
      },
      //滑动验证码的滑块大小
      blockSize: {
        type: Object,
        default() {
          return {
            width: '59px',
            height: '40px',
          }
        },
      },
      //移动条容器大小
      barSize: {
        type: Object,
        default() {
          return {
            width: '280px',
            height: '40px',
          }
        },
      },
    },
    data() {
      return {
        clickShow: false,
        // 内部类型
        verifyType: undefined,
        // 所用组件类型
        componentType: undefined,
      }
    },
    computed: {
      instance() {
        return this.$refs.instance || {}
      },
      showBox() {
        if (this.mode === 'pop') {
          return this.clickShow
        } else {
          return true
        }
      },
    },
    watch: {
      captchaType: {
        immediate: true,
        handler(captchaType) {
          switch (captchaType.toString()) {
            case 'slider':
              this.verifyType = '2'
              this.componentType = 'VerifySlide2'
              break
            case 'click_word':
              this.verifyType = ''
              this.componentType = 'VerifyPoints'
              break
          }
        },
      },
    },
    methods: {
      /**
       * i18n
       * @description 兼容vue-i18n 调用$t来转换ok
       * @param {String} text-被转换的目标
       * @return {String} i18n的结果
       * */
      i18n(text) {
        if (this.$t) {
          return this.$t(text)
        } else {
          // 兼容不存在的语言
          let i18n =
            this.$options.i18n.messages[this.locale] ||
            this.$options.i18n.messages['en-US']
          return i18n[text]
        }
      },
      /**
       * refresh
       * @description 刷新
       * */
      refresh() {
        if (this.instance.refresh) {
          this.instance.refresh()
        }
      },
      closeBox() {
        this.clickShow = false
        this.refresh()
      },
      show() {
        if (this.mode === 'pop') {
          this.clickShow = true
        }
      },
    },
  }
</script>
<style>
  /*弹框基础样式*/
  .mask {
    cursor: auto;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: auto;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1001;
    transition: all 0.5s;
  }
  /*弹框样式*/
  .verifybox {
    position: relative;
    border-radius: 2px;
    background-color: #fff;
    margin: 300px auto 0 auto;
  }
  /*弹框顶部描述样式*/
  .verifybox-top {
    padding: 10px;
    margin: 0 auto;
    text-align: left;
    font-weight: 400;
    font-size: 16px;
    border-bottom: 1px solid #e4e7eb;
    box-sizing: border-box;
  }
  /*关闭弹框样式*/
  .verifybox-close {
    position: absolute;
    right: 0;
    margin: 0 auto;
    padding: 0 10px;
    font-size: 16px;
    font-weight: 400;
    text-align: center;
    cursor: pointer;
  }
  /*弹框内容样式*/
  .verifybox-content {
    padding: 10px;
    box-sizing: content-box;
  }
  .verify-img-container {
    position: relative;
  }
  /*滑块背景样式*/
  .verify-slider-bg {
    max-width: initial;
    object-fit: fill;
  }
  /*滑块样式*/
  .verify-slider-front {
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    height: 100%;
    width: auto;
    object-fit: fill;
  }
  /*刷新按钮*/
  .verify-refresh {
    position: absolute;
    display: block;
    pointer-events: auto;
    cursor: pointer;
    top: 10px;
    right: 10px;
    width: 30px;
    height: 30px;
    transition: 200ms;
    background-image: url('~@/assets/refresh.png');
    background-size: cover;
  }
  .verify-tips {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    line-height: 30px;
    white-space: nowrap;
    overflow: hidden;
    padding-left: 20px;
    color: #88949d;
  }
  /*验证码过渡成功动画*/
  .success-bg {
    background-color: rgba(92, 184, 92, 0.5);
    filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7f5CB85C, endcolorstr=#7f5CB85C);
  }
  /*验证码过渡失败动画*/
  .error-bg {
    background-color: rgba(217, 83, 79, 0.5);
    filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7fD9534F, endcolorstr=#7fD9534F);
  }
  /*验证码过渡动画*/
  .slider-tip-enter,
  .slider-tip-leave-to {
    bottom: -30px;
  }
  /*验证码过渡动画*/
  .slider-tip-enter-active,
  .slider-tip-leave-active {
    transition: bottom 0.5s;
  }
  /*滑动验证码滑块区域*/
  .verify-slider-area {
    position: relative;
    text-align: center;
    margin-top: 10px;
    background: #f7f9fa;
    height: 40px;
    left: 0;
    line-height: 40px;
    font-weight: 300;
    cursor: default;
    border: 1px solid #e3e7eb;
    border-radius: 2px;
  }
  /*滑块移动条样式*/
  .verify-msg {
    font-size: 14px;
    overflow: hidden;
    color: #88949d;
  }
  /*滑动验证码滑块*/
  .verify-slider-left-bar {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #92e6fa;
  }
  /*滑块内容颜色*/
  .verify-slider-left-bar-sign {
    position: relative;
    color: #03b703;
  }
  .verify-move-block {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #ffffff;
    box-sizing: border-box;
    cursor: move;
    border-radius: 2px;
    font-weight: bold;
    box-shadow: 0 0 3px #888888;
  }
  .verify-sub-block {
    text-align: center;
    z-index: 3;
    /* border: 1px solid #fff; */
  }
  /* ---------------------------- */
  /*常规验证码*/
  .verify-img-panel {
    margin: 0;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    border-radius: 3px;
    position: relative;
  }

  .verify-img-panel {
    width: 25px;
    height: 25px;
    text-align: center;
    padding: 5px;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    font-size: 25px;
  }

  .verify-img-panel {
    font-size: 20px;
    color: #fff;
  }

  .verify-img-panel .verify-gap {
    background-color: #fff;
    position: relative;
    z-index: 2;
    border: 1px solid #fff;
  }
</style>
