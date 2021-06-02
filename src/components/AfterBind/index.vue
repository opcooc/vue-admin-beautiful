<template>
  <div class="after-bind-mobile-container-content">
    <el-form
      ref="phoneLoginForm"
      style="padding-right: 0"
      :model="phoneLoginForm"
      :rules="phoneLoginRules"
      label-position="left"
    >
      <el-form-item prop="phone">
        <el-select
          v-model="phoneLoginForm.areaCode"
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
          v-model.trim="phoneLoginForm.phone"
          placeholder=" 手机号"
          tabindex="1"
          maxlength="11"
          class="mobile-right-input"
          show-word-limit
          type="text"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item prop="phoneCode" style="position: relative">
        <el-input
          v-model.trim="phoneLoginForm.phoneCode"
          type="text"
          placeholder="请输入 6 位短信验证码"
        ></el-input>
        <el-button
          class="show-pwd phone-code"
          :disabled="isGetphone"
          @click="beforeSendMobileCodeChick"
        >
          {{ phoneCode }}
        </el-button>
      </el-form-item>
      <div class="login-options">
        <el-link type="info" :underline="false">接收语音验证码?</el-link>
      </div>
      <el-button
        :loading="loading"
        size="medium"
        class="login-btn"
        type="primary"
        @click="handleBindMobile"
      >
        确认
      </el-button>
    </el-form>
    <Verify
      ref="verify"
      :captcha-type="'slider'"
      @success="sendMobileCode"
    ></Verify>
  </div>
</template>

<script>
  import { aesEncrypt } from '@/utils/ase'
  import { reqMobileGet } from '@/api/captcha'
  import { isPhone } from '@/utils/validate'
  import Verify from '@/components/verifition/Verify'
  export default {
    name: 'AfterBind',
    components: {
      Verify,
    },
    props: {
      afterBind: {
        type: Function,
        default: null,
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
        nodeEnv: process.env.NODE_ENV,
        isGetphone: false,
        phoneCode: '获取验证码',
        phoneLoginForm: {
          areaCode: '1',
          phone: '18627985217',
          phoneCode: '',
          token: '',
          secretKey: '',
        },
        phoneLoginRules: {
          phone: [
            { required: true, trigger: 'blur', message: '请输入手机号码' },
            { validator: validatePhone, trigger: 'blur' },
          ],
          phoneCode: [
            { required: true, trigger: 'blur', message: '请输入手机验证码' },
          ],
        },
        loading: false,
        verifyType: '',
        accessToken: '',
        redirect: undefined,
        select: '',
      }
    },
    watch: {
      $route: {
        handler(route) {
          this.redirect = (route.query && route.query.redirect) || '/'
        },
        immediate: true,
      },
    },
    created() {
      document.body.style.overflow = 'hidden'
    },
    beforeDestroy() {
      document.body.style.overflow = 'auto'
    },
    mounted() {
      this.empty('phoneLoginForm')
      this.accessToken = this.$route.params.accessToken
    },
    methods: {
      empty(form) {
        //重置
        //根据需求二选一
        /**
         * 移除校验结果并重置字段值
         * 注：清除表单项name的校验及数值
         */
        this.$refs[form].resetFields()
        /**
         * 移除校验结果
         * 注：只清除表单项name的校验，不清楚表单项name的数值
         */
        // this.$refs.form.clearValidate('name')
      },
      beforeSendMobileCodeChick() {
        this.verifyType = 'mobileCode'
        this.$refs.verify.show()
      },
      sendMobileCode(params) {
        if (!isPhone(this.phoneLoginForm.phone)) {
          //this.$baseMessage('请输入手机号', 'error')
          this.$refs['phoneLoginForm'].validateField('phone')
          return
        }
        let data = {
          captchaType: 'sms',
          token: params.token,
          validate: params.validate,
          mobile: this.phoneLoginForm.phone,
        }
        reqMobileGet(data).then((res) => {
          if (res.code === 901) {
            this.isGetphone = true
            let n = 60
            this.getPhoneIntval = setInterval(() => {
              if (n > 0) {
                n--
                this.phoneCode = '重新获取(' + n + 's)'
              } else {
                this.getPhoneIntval = null
                clearInterval(this.getPhoneIntval)
                this.phoneCode = '获取验证码'
                this.isGetphone = false
              }
            }, 1000)
            this.phoneLoginForm.secretKey = res.data.secretKey
            this.phoneLoginForm.token = res.data.token
          }
        })
      },
      handleBindMobile(params) {
        let data = {
          account: this.phoneLoginForm.phone,
          source: 'mobile',
          data: aesEncrypt(params.code, this.phoneLoginForm.secretKey),
          token: this.phoneLoginForm.token,
          captchaType: 'sms',
        }
        console.log(data)
        if (this.afterBind) {
          this.afterBind(data)
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  /* sign-tab登录标签 */
  .after-bind-mobile-container-content {
    width: 440px;
    min-width: 300px;
    margin: 0 auto;
    .login-btn {
      width: 100%;
      margin-top: 15px;
    }
    .mobile-left-select {
      left: 0;
      width: 25%;
    }
    .mobile-right-input {
      position: absolute;
      width: 75%;
    }
    .login-options {
      padding: 0 0 15px 0;
      position: relative;
      overflow: hidden;
      text-align: right;
    }

    .show-pwd {
      position: absolute;
      top: 6px;
      right: 0;
      font-size: 15px;
      color: #175199;
      cursor: pointer;
      user-select: none;
    }
    .phone-code {
      border-width: 0 0 0 0;
    }
  }
</style>
