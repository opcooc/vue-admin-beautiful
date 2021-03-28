<template>
  <div>
    <div
      class="verify-img-container"
      :style="{ width: setSize.imgWidth, height: setSize.imgHeight }"
    >
      <img
        class="verify-slider-bg"
        :src="'data:image/png;base64,' + backImgBase"
        alt=""
        :style="{
          width: setSize.imgWidth,
          height: setSize.imgHeight,
        }"
      />
      <img
        class="verify-slider-front"
        :src="'data:image/png;base64,' + blockBackImgBase"
        alt=""
        :style="{
          left: moveBlockLeft,
        }"
      />
      <div
        v-show="showRefresh"
        class="verify-refresh"
        :style="{ transform: 'rotate(' + refreshNumber * 90 + 'deg)' }"
        @click="refresh"
      ></div>
    </div>
    <div
      class="verify-slider-area"
      :style="{
        width: setSize.imgWidth,
        height: barSize.height,
        'line-height': barSize.height,
      }"
    >
      <transition name="slider-tip">
        <span
          v-if="tipWords"
          class="verify-tips"
          :class="passFlag ? 'success-bg' : 'error-bg'"
        >
          {{ tipWords }}
        </span>
      </transition>
      <div class="verify-msg" :style="{ 'padding-left': blockSize.width }">
        {{ text }}
      </div>
      <div
        class="verify-slider-left-bar"
        :style="{
          width: leftBarWidth !== undefined ? leftBarWidth : blockSize.width,
          height: blockSize.height,
          transaction: transitionWidth,
          'border-color': leftBarBorderColor,
        }"
      >
        <div
          class="verify-move-block"
          :style="{
            width: blockSize.width,
            height: blockSize.height,
            left: moveBlockLeft,
            transition: transitionLeft,
          }"
          @touchstart="start"
          @mousedown="start"
        >
          <span class="verify-slider-left-bar-sign">> ></span>
        </div>
      </div>
    </div>
    <div>
      <span>
        moveBlockLeft: {{ moveBlockLeft }}
        <br />
      </span>
      <span>
        leftBarWidth: {{ leftBarWidth }}
        <br />
      </span>
    </div>
  </div>
</template>
<script type="text/babel">
  /**
   * VerifySlide
   * @description 滑块
   * */
  import { aesEncrypt } from '@/utils/ase'
  import { resetSize } from './../utils/util'
  import { reqGet, reqCheck } from '@/api/captcha'

  export default {
    name: 'VerifySlide2',
    props: {
      captchaType: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        default: '1',
      },
      //弹出式pop，固定fixed
      mode: {
        type: String,
        required: true,
      },
      vSpace: {
        type: Number,
        required: true,
      },
      explain: {
        type: String,
        required: true,
      },
      imgSize: {
        type: Object,
        required: true,
      },
      blockSize: {
        type: Object,
        required: true,
      },
      barSize: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        secretKey: '', //后端返回的加密秘钥 字段
        passFlag: '', //是否通过的标识
        backImgBase: '', //验证码背景图片
        blockBackImgBase: '', //验证滑块的背景图片
        backToken: '', //后端返回的唯一token值
        startMoveTime: '', //移动开始的时间
        endMovetime: '', //移动结束的时间
        tipsBackColor: '', //提示词的背景颜色
        slideY: '',
        tipWords: '',
        text: '',
        refreshNumber: 1,
        setSize: {
          imgHeight: 0,
          imgWidth: 0,
          barHeight: 0,
          barWidth: 0,
        },
        top: 0,
        left: 0,
        moveBlockLeft: undefined,
        leftBarWidth: undefined,
        // 移动中样式
        leftBarBorderColor: '#ddd',
        status: false, //鼠标状态
        isEnd: false, //是够验证完成
        showRefresh: true,
        transitionLeft: '',
        transitionWidth: '',
      }
    },
    computed: {
      barArea() {
        return this.$el.querySelector('.verify-slider-area')
      },
      resetSize() {
        return resetSize
      },
    },
    watch: {
      // type变化则全面刷新
      type: {
        immediate: true,
        handler() {
          this.init()
        },
      },
    },
    mounted() {
      // 禁止拖拽
      this.$el.onselectstart = function () {
        return false
      }
    },
    methods: {
      init() {
        this.text = this.explain
        this.getPictrue()
        this.$nextTick(() => {
          let setSize = this.resetSize(this) //重新设置宽度高度
          for (let key in setSize) {
            this.$set(this.setSize, key, setSize[key])
          }
          this.$parent.$emit('ready', this)
        })

        var _this = this

        window.removeEventListener('touchmove', function (e) {
          _this.move(e)
        })
        window.removeEventListener('mousemove', function (e) {
          _this.move(e)
        })

        //鼠标松开
        window.removeEventListener('touchend', function () {
          _this.end()
        })
        window.removeEventListener('mouseup', function () {
          _this.end()
        })

        window.addEventListener('touchmove', function (e) {
          _this.move(e)
        })
        window.addEventListener('mousemove', function (e) {
          _this.move(e)
        })

        //鼠标松开
        window.addEventListener('touchend', function () {
          _this.end()
        })
        window.addEventListener('mouseup', function () {
          _this.end()
        })
      },

      //鼠标按下
      start: function (e) {
        e = e || window.event
        if (!e.touches) {
          //兼容PC端
          var x = e.clientX
        } else {
          //兼容移动端
          var x = e.touches[0].pageX
        }
        this.startLeft = Math.floor(
          x - this.barArea.getBoundingClientRect().left
        )
        this.startMoveTime = +new Date() //开始滑动的时间
        if (this.isEnd === false) {
          this.text = ''
          this.leftBarBorderColor = '#337AB7'
          e.stopPropagation()
          this.status = true
        }
      },
      //鼠标移动
      move: function (e) {
        e = e || window.event
        if (this.status && this.isEnd === false) {
          if (!e.touches) {
            //兼容PC端
            var x = e.clientX
          } else {
            //兼容移动端
            var x = e.touches[0].pageX
          }
          let bar_area_left = this.barArea.getBoundingClientRect().left
          let move_block_left = x - bar_area_left - this.startLeft //小方块相对于父元素的left值
          let maxWidth =
            this.barArea.offsetWidth - parseInt(this.blockSize.width) - 2
          if (move_block_left >= maxWidth) {
            move_block_left = maxWidth
          }
          if (move_block_left <= 0) {
            move_block_left = 0
          }
          //拖动后小方块的left值
          this.moveBlockLeft = move_block_left + 'px'
          this.leftBarWidth = move_block_left + 'px'
        }
      },

      //鼠标松开
      end: function () {
        this.endMovetime = +new Date()
        var _this = this
        //判断是否重合
        if (this.status && this.isEnd === false) {
          var moveLeftDistance = parseInt(
            (this.moveBlockLeft || '').replace('px', '')
          )
          console.log(moveLeftDistance)
          moveLeftDistance =
            (moveLeftDistance * 350) / parseInt(this.setSize.imgWidth)
          console.log(this.setSize.imgWidth)
          console.log(moveLeftDistance)
          let data = {
            captchaType: this.captchaType,
            data: this.secretKey
              ? aesEncrypt(
                  JSON.stringify({ x: moveLeftDistance, y: this.slideY }),
                  this.secretKey
                )
              : JSON.stringify({ x: moveLeftDistance, y: this.slideY }),
            token: this.backToken,
          }
          reqCheck(data).then((res) => {
            if (res.code === 901) {
              this.leftBarBorderColor = '#5cb85c'
              this.showRefresh = false
              this.isEnd = true
              if (this.mode === 'pop') {
                setTimeout(() => {
                  this.$parent.clickShow = false
                  this.refresh()
                }, 1500)
              }
              this.passFlag = true
              this.tipWords = `${(
                (this.endMovetime - this.startMoveTime) /
                1000
              ).toFixed(2)}s验证成功`
              // var captchaVerification = this.secretKey
              //   ? aesEncrypt(
              //       this.backToken +
              //         '---' +
              //         JSON.stringify({ x: moveLeftDistance, y: 5.0 }),
              //       this.secretKey
              //     )
              //   : this.backToken +
              //     '---' +
              //     JSON.stringify({ x: moveLeftDistance, y: 5.0 })
              setTimeout(() => {
                this.tipWords = ''
                this.$parent.closeBox()
                this.$parent.$emit('success', res.data)
              }, 1000)
            } else {
              this.leftBarBorderColor = '#d9534f'
              this.passFlag = false
              setTimeout(function () {
                _this.refresh()
              }, 1000)
              this.$parent.$emit('error', this)
              this.tipWords = '验证失败'
              setTimeout(() => {
                this.tipWords = ''
              }, 1000)
            }
          })
          this.status = false
        }
      },

      refresh: function () {
        this.showRefresh = true
        this.refreshNumber = this.refreshNumber + 1
        this.transitionLeft = 'left .3s'
        this.moveBlockLeft = 0

        this.leftBarWidth = undefined
        this.transitionWidth = 'width .3s'

        this.leftBarBorderColor = '#ddd'
        this.isEnd = false

        this.getPictrue()
        setTimeout(() => {
          this.transitionWidth = ''
          this.transitionLeft = ''
          this.text = this.explain
        }, 300)
      },

      // 请求背景图片和验证图片
      getPictrue() {
        let data = {
          captchaType: this.captchaType,
        }
        reqGet(data).then((res) => {
          if (res.code === 901) {
            this.backImgBase = res.data.background
            this.blockBackImgBase = res.data.front
            this.backToken = res.data.token
            this.secretKey = res.data.secretKey
            this.slideY = res.data.slideY
          } else {
            this.tipWords = res.message
          }
        })
      },
    },
  }
</script>
