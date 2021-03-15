<template>
  <div class="mobile-verify-content">
    <el-form
      ref="phoneLoginForm"
      :model="phoneLoginForm"
      :rules="phoneLoginRules"
      label-position="left"
    >
      <el-form-item prop="mobile">
        <el-select
          v-model="phoneLoginForm.areaCode"
          :disabled="isDisabled"
          class="mobile-left-select"
          placeholder="中国 +86"
        >
          <el-option label="中国 +86" value="1"></el-option>
          <el-option label="中国香港 +852" value="2"></el-option>
          <el-option label="中国澳门 +853" value="3"></el-option>
          <el-option label="中国台湾 +886" value="4"></el-option>
          <el-option label="美国 +1" value="5"></el-option>
          <el-option label="日本 +81" value="6"></el-option>
          <el-option label="马来西亚 +60" value="7"></el-option>
          <el-option label="澳大利亚 +61" value="8"></el-option>
          <el-option label="加拿大 +1" value="9"></el-option>
          <el-option label="英国 +44" value="10"></el-option>
          <el-option label="新加坡 +65" value="11"></el-option>
          <el-option label="德国 +49" value="12"></el-option>
          <el-option label="俄罗斯 +7" value="13"></el-option>
          <el-option label="埃及 +20" value="14"></el-option>
          <el-option label="南非 +27" value="15"></el-option>
          <el-option label="希腊 +30" value="16"></el-option>
          <el-option label="荷兰 +31" value="17"></el-option>
        </el-select>
        <el-input
          v-model="phoneLoginForm.mobile"
          placeholder=" 手机号"
          tabindex="1"
          maxlength="11"
          class="mobile-right-input"
          show-word-limit
          :disabled="isDisabled"
          autocomplete="off"
          type="text"
        ></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input
          v-model.trim="phoneLoginForm.code"
          type="text"
          placeholder="请输入 6 位短信验证码"
        ></el-input>
        <el-button
          class="phone-code"
          :disabled="isSend"
          @click="beforeSendMobileCodeChick"
        >
          {{ phoneCode }}
        </el-button>
      </el-form-item>
      <el-button
        size="medium"
        class="login-button"
        type="primary"
        @click="handleConfirmClick"
      >
        {{ confirmButtonName }}
      </el-button>
    </el-form>
    <Verify
      ref="verify"
      :mode="'pop'"
      :captcha-type="captchaType"
      :img-size="{ width: '350px', height: '213px' }"
      @success="successVerify"
    ></Verify>
  </div>
</template>

<script>
  import { isBlank, isPhone } from '@/utils/validate'
  import Verify from '@/components/verifition/Verify'
  import { reqMobileGet } from '@/api/captcha'

  export default {
    name: 'MobileVerify',
    components: {
      Verify,
    },
    props: {
      confirmButtonName: {
        type: String,
        default: '',
        required: true,
      },
      isSliderVerify: {
        type: Boolean,
        default: true,
      },
      userId: {
        type: String,
        default: '',
      },
      stepType: {
        type: String,
        default: '',
      },
      isDisabled: {
        type: Boolean,
        default: false,
      },
      //验证码类型
      captchaType: {
        type: String,
        default: '',
        required: true,
      },
      //手机号
      mobileParam: {
        type: String,
        default: '',
      },
    },
    data() {
      const validatePhone = (rule, value, callback) => {
        if (!isPhone(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
      return {
        isSend: false,
        phoneCode: '获取验证码',
        phoneLoginForm: {
          areaCode: '1',
          code: '',
          token: '',
          secretKey: '',
          mobile: '',
          stepType: '',
        },
        phoneLoginRules: {
          mobile: [
            { required: true, trigger: 'blur', message: '请输入手机号码' },
            { validator: validatePhone, trigger: 'blur' },
          ],
          code: [
            { required: true, trigger: 'blur', message: '请输入手机验证码' },
          ],
        },
      }
    },
    created() {
      this.phoneLoginForm.mobile = this.mobileParam
    },
    methods: {
      beforeSendMobileCodeChick() {
        if (this.isSliderVerify) {
          if (!isPhone(this.phoneLoginForm.mobile)) {
            //this.$baseMessage('请输入手机号', 'error')
            this.$refs['phoneLoginForm'].validateField('mobile')
            return
          }
          this.$refs.verify.show()
        } else {
          let data = {
            captchaType: 'sms',
            extraData: {
              notPreCheck: true,
              userId: this.userId,
            },
          }
          this.sendMobileCode(data)
        }
      },
      successVerify(params) {
        let data = {
          captchaType: 'sms',
          token: params.token,
          validate: params.validate,
          mobile: this.phoneLoginForm.mobile,
        }
        this.sendMobileCode(data)
      },
      sendMobileCode(data) {
        reqMobileGet(data).then((res) => {
          if (res.code === 901) {
            this.isSend = true
            let n = res.data.expireIn
            this.getPhoneIntval = setInterval(() => {
              if (n > 0) {
                n--
                this.phoneCode = '重新获取(' + n + 's)'
              } else {
                this.getPhoneIntval = null
                clearInterval(this.getPhoneIntval)
                this.phoneCode = '获取验证码'
                this.isSend = false
              }
            }, 1000)
            this.phoneLoginForm.secretKey = res.data.secretKey
            this.phoneLoginForm.token = res.data.token
          }
        })
      },
      handleConfirmClick() {
        this.phoneLoginForm.stepType = this.stepType
        this.$emit('success', this.phoneLoginForm)
        this.phoneLoginForm.mobile = ''
        this.phoneLoginForm.code = ''
      },
    },
  }
</script>

<style lang="scss" scoped>
  .mobile-verify-content {
    .mobile-left-select {
      left: 0;
      width: 25%;
    }
    .mobile-right-input {
      position: absolute;
      width: 75%;
    }
    .login-button {
      width: 100%;
      margin-top: 5px;
    }
    .phone-code {
      position: absolute;
      top: 6px;
      right: 0;
      font-size: 15px;
      color: #175199;
      cursor: pointer;
      user-select: none;
      border-width: 0 0 0 0;
    }
    ::v-deep {
      .el-form {
        padding-right: 0;
      }
      .el-input__inner {
        height: 45px;
        padding: 0 0 0 0;
        font-size: 15px;
        font-weight: 500;
        border-width: 0 0 1px 0;
        border-radius: 0;
      }
    }
  }
</style>
