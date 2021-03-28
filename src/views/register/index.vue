<template>
  <div class="login-container">
    <el-alert
      title="欢迎来到cosmos"
      type="success"
      :closable="false"
      style="position: fixed"
    ></el-alert>
    <el-row>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <div style="color: transparent">占位符</div>
      </el-col>
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
        <div class="sign-container-content">
          <div class="title">
            <span class="previous-login" @click="handlePreviousLogin">
              <vab-icon :icon="['fas', 'chevron-left']"></vab-icon>
            </span>
            <div class="title-info">绑定手机号</div>
          </div>
          <div class="sign-flow-login-content">
            <el-form
              ref="registerForm"
              :model="registerForm"
              :rules="registerRules"
              label-position="left"
            >
              <el-form-item prop="phone">
                <el-select
                  v-model="registerForm.areaCode"
                  style="width: 25%"
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
                  v-model.trim="registerForm.phone"
                  placeholder=" 手机号"
                  tabindex="1"
                  maxlength="11"
                  style="width: 75%"
                  show-word-limit
                  type="text"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item prop="phoneCode" style="position: relative">
                <el-input
                  v-model.trim="registerForm.phoneCode"
                  type="text"
                  placeholder="请输入 6 位短信验证码"
                ></el-input>
                <el-button
                  class="show-pwd phone-code"
                  :disabled="isGetphone"
                  @click="getPhoneCode"
                >
                  {{ phoneCode }}
                </el-button>
              </el-form-item>
              <div class="login-options">
                <el-link type="info" :underline="false">
                  接收语音验证码?
                </el-link>
              </div>
              <el-button
                :loading="loading"
                size="medium"
                class="login-btn"
                type="primary"
                @click="handleLogin"
              >
                进入opcooc
              </el-button>
            </el-form>
            <div class="form-social-line"></div>
            <div class="social-login">
              <div
                style="
                  float: left;
                  height: 44px;
                  display: flex;
                  align-items: center;
                "
              >
                社交帐号登录
              </div>
              <div style="float: right">
                <div class="social-block" @click="handleSocialLogin('wechat')">
                  <img src="~@/assets/login_images/wechat.png" />
                  <p>微信</p>
                </div>
                <div class="social-block" @click="handleSocialLogin('qq')">
                  <img src="~@/assets/login_images/qq.png" />
                  <p>QQ</p>
                </div>
                <div class="social-block" @click="handleSocialLogin('weibo')">
                  <img src="~@/assets/login_images/weibo.png" />
                  <p>微博</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :xs="6" :sm="6" :md="6" :lg="6" :xl="6">
        <div style="color: transparent">占位符</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { openWindow } from '@/utils/open-window'
  import { baseURL } from '@/config/settings'
  import { isPhone } from '@/utils/validate'
  import {
    getTemporaryToken,
    removeTemporaryToken,
  } from '@/utils/socialTemporaryToken'

  export default {
    name: 'Register',
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
        title: this.$baseTitle,
        isGetphone: false,
        phoneCode: '获取验证码',
        registerForm: {
          areaCode: '1',
          phone: '',
          phoneCode: '',
        },
        registerRules: {
          phone: [
            { required: true, trigger: 'blur', message: '请输入手机号码' },
            { validator: validatePhone, trigger: 'blur' },
          ],
          phoneCode: [
            { required: true, trigger: 'blur', message: '请输入手机验证码' },
          ],
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined,
        socialAuthorizationUrl: baseURL + '/auth2/authorization/',
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
      this.empty('registerForm')
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
      handlePreviousLogin() {
        removeTemporaryToken()
        this.$router.push('/login').catch(() => {})
      },
      getPhoneCode() {
        if (!isPhone(this.registerForm.phone)) {
          //this.$baseMessage('请输入手机号', 'error')
          this.$refs['registerForm'].validateField('phone')
          return
        }
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
      },
      handleLogin() {
        console.log('handleLogin' + getTemporaryToken())
        this.$refs.registerForm.validate((valid) => {
          if (valid) {
            this.loading = true
            this.$store
              .dispatch('user/login', this.form)
              .then(() => {
                const routerPath =
                  this.redirect === '/404' || this.redirect === '/401'
                    ? '/'
                    : this.redirect
                this.$router.push(routerPath).catch(() => {})
                this.loading = false
              })
              .catch(() => {
                this.loading = false
              })
          } else {
            return false
          }
        })
      },
      handleSocialLogin(providerId) {
        const url = this.socialAuthorizationUrl + providerId
        console.log(url)
        openWindow(url, '第三方登录', 540, 540)
        window.addEventListener('message', this.loginSocial, false)
      },
      loginSocial(e) {
        const socialToken = e.data
        if (socialToken) {
          this.$store
            .dispatch('user/loginSocial1', socialToken)
            .then(() => {
              const routerPath =
                this.redirect === '/404' || this.redirect === '/401'
                  ? '/'
                  : this.redirect
              this.$router.push(routerPath).catch(() => {})
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
          window.removeEventListener('message', this.loginSocial, false)
        } else {
          this.$baseMessage('第三方授权失败!', 'error')
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
  .login-container {
    width: 100%;
    max-width: 100%;
    background: url('~@/assets/login_images/login_background.jpg') center center
      fixed no-repeat;
    background-size: cover;

    .login-btn {
      width: 100%;
      margin-top: 15px;
    }

    /* sign-tab登录标签 */
    .sign-container-content {
      position: relative;
      max-width: 50%;
      margin: calc((100vh - 500px) / 2) calc((100vh - 400px) / 2)
        calc((100vh - 500px) / 2) calc((100vh - 400px) / 2);
      overflow: hidden;
      background-color: #fff;
      border-radius: 2px;

      .sign-flow-login-content {
        padding: 0 24px 20px;
        overflow: hidden;

        .login-options {
          padding: 0 0 15px 0;
          position: relative;
          overflow: hidden;
          text-align: right;
        }

        .form-social-line {
          margin: 30px 0 15px 0;
          border-top: 1px solid #ebebeb;
        }
        .social-login {
          color: #8590a6;
          font-size: 16px;
          font-weight: 500;
        }

        .social-block {
          display: inline-block;
          font-size: 14px;
          cursor: pointer;
          margin-left: 22px;
          p {
            display: inline-block;
          }
          img {
            width: 20px;
            height: 20px;
            margin-right: 6px;
            vertical-align: middle;
          }
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
          border-top-width: 0;
          border-left-width: 0;
          border-right-width: 0;
          border-bottom-width: 0;
          font-size: 15px;
          font-weight: 500;
        }
        ::v-deep {
          /*tabs 去掉el-tab的灰色下划线*/
          .el-tabs__nav-wrap::after {
            position: static !important;
          }
          .el-tabs__item {
            padding: 0 !important;
            display: inline-block;
            color: #121212;
            border: none;
            height: 60px;
            line-height: 60px;
            margin: 0 10px 0 0;
            font-size: 16px;
            cursor: pointer;
          }
          .el-tabs__item.is-active {
            font-weight: 600;
            border-bottom: 3px solid #0084ff;
          }
          /*tabs 去掉el-tab-pane切换时的蓝色下划线*/
          .el-tabs__active-bar {
            background-color: transparent !important;
          }
          .el-input__inner {
            height: 45px;
            padding: 0 0 0 0;
            border-top-width: 0;
            border-left-width: 0;
            border-right-width: 0;
            border-bottom-width: 1px;
            font-size: 15px;
            font-weight: 500;
            border-radius: 0;
          }
        }
      }
      .title {
        display: inline-block;
        margin: 30px 0 25px 0;
      }
      .previous-login {
        font-size: 16px;
        margin-left: 20px;
        color: #2c3e50;
        text-align: center;
        cursor: pointer;
      }
      .title-info {
        margin-left: 120px;
        display: inline-block;
        position: relative;
        font-size: 25px;
        font-weight: unset;
        color: #2c3e50;
        text-align: center;
      }
    }
  }
</style>
