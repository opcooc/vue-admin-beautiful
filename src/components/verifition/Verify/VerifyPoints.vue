<template>
  <div style="position: relative">
    <div class="verify-img-out">
      <div
        class="verify-img-panel"
        :style="{
          width: setSize.imgWidth,
          height: setSize.imgHeight,
          'background-size': setSize.imgWidth + ' ' + setSize.imgHeight,
          'margin-bottom': vSpace + 'px',
        }"
      >
        <div
          v-show="showRefresh"
          class="verify-refresh"
          style="z-index: 3"
          @click="refresh"
        >
          <vab-colorful-icon :icon-class="'refresh'" />
        </div>
        <img
          ref="canvas"
          :src="'data:image/png;base64,' + pointBackImgBase"
          alt=""
          style="width: 100%; height: 100%; display: block"
          @click="bindingClick ? canvasClick($event) : undefined"
        />

        <div
          v-for="(tempPoint, index) in tempPoints"
          :key="index"
          class="point-area"
          :style="{
            'background-color': '#1abd6c',
            color: '#fff',
            'z-index': 9999,
            width: '20px',
            height: '20px',
            'text-align': 'center',
            'line-height': '20px',
            'border-radius': '50%',
            position: 'absolute',
            top: parseInt(tempPoint.y - 10) + 'px',
            left: parseInt(tempPoint.x - 10) + 'px',
          }"
        >
          {{ index + 1 }}
        </div>
      </div>
    </div>
    <!-- 'height': this.barSize.height, -->
    <div
      class="verify-bar-area"
      :style="{
        width: setSize.imgWidth,
        color: barAreaColor,
        'border-color': barAreaBorderColor,
        'line-height': barSize.height,
      }"
    >
      <span class="verify-msg">{{ text }}</span>
    </div>
  </div>
</template>
<script type="text/babel">
  /**
   * VerifyPoints
   * @description 点选
   * */
  import {
    resetSize,
    _code_chars,
    _code_color1,
    _code_color2,
  } from './../utils/util'
  import { aesEncrypt } from '@/utils/ase'
  import { reqGet, reqCheck } from '@/api/captcha'

  export default {
    name: 'VerifyPoints',
    props: {
      //弹出式pop，固定fixed
      mode: {
        type: String,
        default: 'fixed',
      },
      // eslint-disable-next-line vue/require-default-prop
      captchaType: {
        type: String,
      },
      //间隔
      vSpace: {
        type: Number,
        default: 5,
      },
      imgSize: {
        type: Object,
        default() {
          return {
            width: '350px',
            height: '213px',
          }
        },
      },
      barSize: {
        type: Object,
        default() {
          return {
            width: '350px',
            height: '40px',
          }
        },
      },
    },
    data() {
      return {
        secretKey: '', //后端返回的ase加密秘钥
        checkNum: 3, //默认需要点击的字数
        fontPos: [], //选中的坐标信息
        checkPosArr: [], //用户点击的坐标
        num: 1, //点击的记数
        pointBackImgBase: '', //后端获取到的背景图片
        poinTextList: [], //后端返回的点击字体顺序
        backToken: '', //后端返回的token值
        setSize: {
          imgHeight: 0,
          imgWidth: 0,
          barHeight: 0,
          barWidth: 0,
        },
        tempPoints: [],
        text: '',
        barAreaColor: undefined,
        barAreaBorderColor: undefined,
        showRefresh: true,
        bindingClick: true,
      }
    },
    computed: {
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
        //加载页面
        this.fontPos.splice(0, this.fontPos.length)
        this.checkPosArr.splice(0, this.checkPosArr.length)
        this.num = 1
        this.getPictrue()
        this.$nextTick(() => {
          this.setSize = this.resetSize(this) //重新设置宽度高度
          this.$parent.$emit('ready', this)
        })
      },
      canvasClick(e) {
        this.checkPosArr.push(this.getMousePos(this.$refs.canvas, e))
        if (this.num === this.checkNum) {
          this.num = this.createPoint(this.getMousePos(this.$refs.canvas, e))
          //按比例转换坐标值
          this.checkPosArr = this.pointTransfrom(this.checkPosArr, this.setSize)
          //等创建坐标执行完
          setTimeout(() => {
            // var flag = this.comparePos(this.fontPos, this.checkPosArr);
            //发送后端请求
            // var captchaVerification = this.secretKey
            //   ? aesEncrypt(
            //       this.backToken + '---' + JSON.stringify(this.checkPosArr),
            //       this.secretKey
            //     )
            //   : this.backToken + '---' + JSON.stringify(this.checkPosArr)
            let data = {
              captchaType: this.captchaType,
              data: this.secretKey
                ? aesEncrypt(JSON.stringify(this.checkPosArr), this.secretKey)
                : JSON.stringify(this.checkPosArr),
              token: this.backToken,
            }
            reqCheck(data).then((res) => {
              if (res.code === 901) {
                this.barAreaColor = '#4cae4c'
                this.barAreaBorderColor = '#5cb85c'
                this.text = '验证成功'
                this.bindingClick = false
                if (this.mode == 'pop') {
                  setTimeout(() => {
                    this.$parent.clickShow = false
                    this.refresh()
                  }, 1500)
                }
                this.$parent.$emit('success', res.data)
              } else {
                this.$parent.$emit('error', this)
                this.barAreaColor = '#d9534f'
                this.barAreaBorderColor = '#d9534f'
                this.text = '验证失败'
                setTimeout(() => {
                  this.refresh()
                }, 700)
              }
            })
          }, 400)
        }
        if (this.num < this.checkNum) {
          this.num = this.createPoint(this.getMousePos(this.$refs.canvas, e))
        }
      },

      //获取坐标
      getMousePos: function (obj, e) {
        var x = e.offsetX
        var y = e.offsetY
        return { x, y }
      },
      //创建坐标点
      createPoint: function (pos) {
        this.tempPoints.push(Object.assign({}, pos))
        return ++this.num
      },
      refresh: function () {
        this.tempPoints.splice(0, this.tempPoints.length)
        this.barAreaColor = '#000'
        this.barAreaBorderColor = '#ddd'
        this.bindingClick = true
        this.fontPos.splice(0, this.fontPos.length)
        this.checkPosArr.splice(0, this.checkPosArr.length)
        this.num = 1
        this.getPictrue()
        this.text = '验证失败'
        this.showRefresh = true
      },

      // 请求背景图片和验证图片
      getPictrue() {
        let data = {
          captchaType: this.captchaType,
        }
        reqGet(data).then((res) => {
          if (res.code === 901) {
            this.pointBackImgBase = res.data.background
            this.backToken = res.data.token
            this.secretKey = res.data.secretKey
            this.text = '请依次点击【' + res.data.front + '】'
          } else {
            this.text = res.message
          }
        })
      },
      //坐标转换函数
      pointTransfrom(pointArr, imgSize) {
        var newPointArr = pointArr.map((p) => {
          let x = Math.round((350 * p.x) / parseInt(imgSize.imgWidth))
          let y = Math.round((215 * p.y) / parseInt(imgSize.imgHeight))
          return { x, y }
        })
        // console.log(newPointArr,"newPointArr");
        return newPointArr
      },
    },
  }
</script>
