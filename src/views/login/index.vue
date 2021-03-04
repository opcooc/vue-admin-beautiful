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
          <div class="sign-flow-login-content">
            <el-tabs v-model="loginType" @tab-click="handleClick">
              <el-tab-pane label="免密码登录" name="first">
                <el-form
                  ref="phoneLoginForm"
                  :model="phoneLoginForm"
                  :rules="phoneLoginRules"
                  label-position="left"
                >
                  <el-form-item prop="phone">
                    <el-select
                      v-model="phoneLoginForm.areaCode"
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
                      v-model.trim="phoneLoginForm.phone"
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
                      v-model.trim="phoneLoginForm.phoneCode"
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
                    @click="handlePhoneLogin"
                  >
                    注册/登录
                  </el-button>
                  <Verify
                    ref="verify"
                    :mode="'pop'"
                    :captcha-type="'click_word'"
                    :img-size="{ width: '350px', height: '213px' }"
                    @success="successVerify"
                  ></Verify>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="密码登录" name="second">
                <el-form
                  ref="accountLoginForm"
                  :model="accountLoginForm"
                  :rules="accountLoginRules"
                  label-position="left"
                >
                  <el-form-item prop="username">
                    <el-input
                      v-model.trim="accountLoginForm.username"
                      placeholder="手机号或邮箱"
                      tabindex="1"
                      type="text"
                    />
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      :key="passwordType"
                      ref="password"
                      v-model.trim="accountLoginForm.password"
                      :type="passwordType"
                      tabindex="2"
                      placeholder="密码"
                      @keyup.enter.native="handleAccountLogin"
                    />
                    <span
                      v-if="passwordType === 'password'"
                      class="show-password"
                      @click="handlePassword"
                    >
                      <vab-icon :icon="['fas', 'eye-slash']"></vab-icon>
                    </span>
                    <span v-else class="show-password" @click="handlePassword">
                      <vab-icon :icon="['fas', 'eye']"></vab-icon>
                    </span>
                  </el-form-item>
                  <div class="login-options">
                    <el-link type="info" :underline="false">忘记密码?</el-link>
                  </div>
                  <el-button
                    :loading="loading"
                    size="medium"
                    class="login-btn"
                    type="primary"
                    @click="handleAccountLogin"
                  >
                    登录
                  </el-button>
                </el-form>
              </el-tab-pane>
            </el-tabs>
            <div class="sign-container-tip">
              <span>未注册手机验证后自动登录，注册即代表同意</span>
              <el-link type="info" :underline="false">《xxx协议》</el-link>
              <el-link type="info" :underline="false">《隐私保护指引》</el-link>
            </div>
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
  import { socialLogin } from '@/api/user'
  import { baseURL } from '@/config/settings'
  import { isPassword, isPhone } from '@/utils/validate'
  import Verify from '@/components/verifition/Verify'
  import {
    setTemporaryToken,
    getTemporaryToken,
    removeTemporaryToken,
  } from '@/utils/socialTemporaryToken'
  export default {
    name: 'Login',
    components: {
      Verify,
    },
    data() {
      const validateusername = (rule, value, callback) => {
        if ('' === value) {
          callback(new Error('请输入手机号或邮箱'))
        } else {
          callback()
        }
      }
      const validatePassword = (rule, value, callback) => {
        if (!isPassword(value)) {
          callback(new Error('密码不能少于6位'))
        } else {
          callback()
        }
      }
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
        accountLoginForm: {
          username: '18627985217',
          password: '111111',
        },
        accountLoginRules: {
          username: [
            {
              required: true,
              trigger: 'blur',
              validator: validateusername,
            },
          ],
          password: [
            {
              required: true,
              trigger: 'blur',
              validator: validatePassword,
            },
          ],
        },
        phoneLoginForm: {
          areaCode: '1',
          phone: '',
          phoneCode: '',
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
        passwordType: 'password',
        redirect: undefined,
        loginType: 'first',
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
      this.empty('accountLoginForm')
      this.empty('phoneLoginForm')
    },
    methods: {
      handleClick(tab, event) {
        if (tab.name === 'first') {
          this.empty('accountLoginForm')
        } else {
          this.empty('phoneLoginForm')
        }
      },
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
      handlePassword() {
        this.passwordType === 'password'
          ? (this.passwordType = '')
          : (this.passwordType = 'password')
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      getPhoneCode() {
        if (!isPhone(this.phoneLoginForm.phone)) {
          //this.$baseMessage('请输入手机号', 'error')
          this.$refs['phoneLoginForm'].validateField('phone')
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
      successVerify(params) {
        // params 返回的二次验证参数
        console.log(params)
        console.log('success')
      },
      showVerify() {
        //当mode="pop"时,调用组件实例的show方法显示组件
        this.$refs.verify.show()
      },
      handleAccountLogin() {
        this.$refs.accountLoginForm.validate((valid) => {
          console.log(this.accountLoginForm)
          if (valid) {
            this.loading = true
            this.$store
              .dispatch('user/login', this.accountLoginForm)
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
      handlePhoneLogin() {
        this.$refs.verify.show()
        // this.$refs.phoneLoginForm.validate((valid) => {
        //   console.log(this.phoneLoginForm)
        //   if (valid) {
        //     this.loading = true
        //     this.$store
        //       .dispatch('user/login', this.phoneLoginForm)
        //       .then(() => {
        //         const routerPath =
        //           this.redirect === '/404' || this.redirect === '/401'
        //             ? '/'
        //             : this.redirect
        //         this.$router.push(routerPath).catch(() => {})
        //         this.loading = false
        //       })
        //       .catch(() => {
        //         this.loading = false
        //       })
        //   } else {
        //     return false
        //   }
        // })
      },
      handleSocialLogin(providerId) {
        socialLogin(providerId).then((response) => {
          window.open(response.data)
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100vh;
    background: url('~@/assets/login_images/bg.png') center center fixed
      no-repeat;
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
        .sign-container-tip {
          position: relative;
          padding: 40px 0 0 0;
          color: grey;
          font-weight: 500;
        }
        .form-social-line {
          margin: 15px 0 15px 0;
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
    }

    .show-password {
      position: absolute;
      top: 5px;
      right: 1px;
      font-size: 18px;
      color: #8590a6;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
