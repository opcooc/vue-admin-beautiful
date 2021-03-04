<template>
  <div v-show="showBox" :class="mode === 'pop' ? 'mask' : ''">
    <div
      :class="mode === 'pop' ? 'verifybox' : ''"
      :style="{ 'max-width': parseInt(imgSize.width) + 30 + 'px' }"
    >
      <div v-if="mode === 'pop'" class="verifybox-top">
        请完成安全验证
        <span class="verifybox-close" @click="closeBox">
          <vab-colorful-icon :icon-class="'close'" />
        </span>
      </div>
      <div
        class="verifybox-bottom"
        :style="{ padding: mode === 'pop' ? '15px' : '0' }"
      >
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
  import VerifyPoints from './Verify/VerifyPoints'

  export default {
    name: 'Vue2Verify',
    components: {
      VerifySlide,
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
      //验证码图片和移动条容器的间隔，默认单位是px。如：间隔为5px，默认:vSpace:5
      vSpace: {
        type: Number,
        default: undefined,
      },
      // 滑动条内的提示，不设置默认是：'向右滑动完成验证'
      explain: {
        type: String,
        default: undefined,
      },
      //背景图片大小
      imgSize: {
        type: Object,
        default: undefined,
      },
      //滑动验证码的滑块大小
      blockSize: {
        type: Object,
        default: undefined,
      },
      //移动条容器大小
      barSize: {
        type: Object,
        default: undefined,
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
              this.componentType = 'VerifySlide'
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
  .verifybox {
    position: relative;
    box-sizing: border-box;
    border-radius: 2px;
    border: 1px solid #e4e7eb;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .verifybox-top {
    padding: 0 15px;
    height: 50px;
    line-height: 50px;
    text-align: left;
    font-size: 16px;
    border-bottom: 1px solid #e4e7eb;
    box-sizing: border-box;
  }
  .verifybox-bottom {
    padding: 15px;
    box-sizing: border-box;
  }
  .verifybox-close {
    position: absolute;
    right: 0;
    padding: 0 15px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1001;
    width: 100%;
    height: 100vh;
    transition: all 0.5s;
  }
  .verify-tips {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 30px;
    line-height: 30px;
    color: #fff;
  }
  .success-bg {
    background-color: rgba(92, 184, 92, 0.5);
    filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7f5CB85C, endcolorstr=#7f5CB85C);
  }
  .error-bg {
    background-color: rgba(217, 83, 79, 0.5);
    filter: progid:DXImageTransform.Microsoft.gradient(startcolorstr=#7fD9534F, endcolorstr=#7fD9534F);
  }
  .tips-enter,
  .tips-leave-to {
    bottom: -30px;
  }
  .tips-enter-active,
  .tips-leave-active {
    transition: bottom 0.5s;
  }
  /* ---------------------------- */
  /*常规验证码*/
  .verify-code {
    font-size: 20px;
    text-align: center;
    cursor: pointer;
    margin-bottom: 5px;
    border: 1px solid #ddd;
  }

  .cerify-code-panel {
    height: 100%;
    overflow: hidden;
  }

  .verify-code-area {
    float: left;
  }

  .verify-input-area {
    float: left;
    width: 60%;
    padding-right: 10px;
  }

  .verify-change-area {
    line-height: 30px;
    float: left;
  }

  .varify-input-code {
    display: inline-block;
    width: 100%;
    height: 25px;
  }

  .verify-change-code {
    color: #337ab7;
    cursor: pointer;
  }

  .verify-btn {
    width: 200px;
    height: 30px;
    background-color: #337ab7;
    color: #ffffff;
    border: none;
    margin-top: 10px;
  }
  .slider-icon-class {
    font-size: 20px;
    text-align: center;
  }

  /*滑动验证码*/
  .verify-bar-area {
    position: relative;
    background: #ffffff;
    text-align: center;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    border: 1px solid #ddd;
    -webkit-border-radius: 4px;
  }

  .verify-bar-area .verify-move-block {
    position: absolute;
    top: 0px;
    left: 0;
    background: #fff;
    cursor: pointer;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    box-shadow: 0 0 2px #888888;
    -webkit-border-radius: 1px;
  }

  .verify-bar-area .verify-move-block:hover {
    background-color: #337ab7;
    color: #ffffff;
  }

  .verify-bar-area .verify-left-bar {
    position: absolute;
    top: -1px;
    left: -1px;
    background: #f0fff0;
    cursor: pointer;
    -webkit-box-sizing: content-box;
    -moz-box-sizing: content-box;
    box-sizing: content-box;
    border: 1px solid #ddd;
  }

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

  .verify-img-panel .verify-refresh {
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

  .verify-bar-area .verify-move-block .verify-sub-block {
    position: absolute;
    text-align: center;
    z-index: 3;
    /* border: 1px solid #fff; */
  }

  .verify-bar-area .verify-move-block .verify-icon {
    font-size: 18px;
  }

  .verify-bar-area .verify-msg {
    z-index: 3;
  }
</style>
