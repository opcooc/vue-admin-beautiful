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
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="免密码登录" name="first">
                <el-form
                  ref="form"
                  :model="form"
                  :rules="rules"
                  label-position="left"
                >
                  <el-form-item prop="username">
                    <el-input
                      v-model.trim="input3"
                      placeholder="手机号"
                      tabindex="1"
                      type="text"
                    >
                      <el-select
                        slot="prepend"
                        v-model="select"
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
                    </el-input>
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      :key="passwordType"
                      ref="password"
                      v-model.trim="form.password"
                      :type="passwordType"
                      tabindex="2"
                      placeholder="请输入 6 位短信验证码"
                      @keyup.enter.native="handleLogin"
                    >
                      <template slot="append">Http://</template>
                    </el-input>
                  </el-form-item>
                  <div class="login-options">
                    <el-link type="info" :underline="false">忘记密码?</el-link>
                  </div>
                  <el-button
                    :loading="loading"
                    size="medium"
                    class="login-btn"
                    type="primary"
                    @click="handleLogin"
                  >
                    注册/登录
                  </el-button>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="密码登录" name="second">
                <el-form
                  ref="form"
                  :model="form"
                  :rules="rules"
                  label-position="left"
                >
                  <el-form-item prop="username">
                    <el-input
                      v-model.trim="form.username"
                      placeholder="手机号或邮箱"
                      tabindex="1"
                      type="text"
                    />
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      :key="passwordType"
                      ref="password"
                      v-model.trim="form.password"
                      :type="passwordType"
                      tabindex="2"
                      placeholder="密码"
                      @keyup.enter.native="handleLogin"
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
                    @click="handleLogin"
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
            <div id="form-social-line"></div>
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
                <div class="social-block" @click="handleSocialLogin(1)">
                  <img src="~@/assets/login_images/wechat.png" />
                  <p>微信</p>
                </div>
                <div class="social-block" @click="handleSocialLogin(2)">
                  <img src="~@/assets/login_images/qq.png" />
                  <p>QQ</p>
                </div>
                <div class="social-block" @click="handleSocialLogin(3)">
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
  import { isPassword } from '@/utils/validate'
  import { openWindow } from '@/utils/open-window'
  import { baseURL } from '@/config/settings'

  export default {
    name: 'Login',
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
      return {
        nodeEnv: process.env.NODE_ENV,
        title: this.$baseTitle,
        form: {
          username: '',
          password: '',
        },
        rules: {
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
        loading: false,
        passwordType: 'password',
        redirect: undefined,
        activeName: 'first',
        input3: '',
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
      this.form.username = ''
      this.form.password = ''
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event)
      },
      handlePassword() {
        this.passwordType === 'password'
          ? (this.passwordType = '')
          : (this.passwordType = 'password')
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleLogin() {
        this.$refs.form.validate((valid) => {
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
      handleSocialLogin() {
        console.log(baseURL + '/auth2/authorization/qq')
        openWindow(baseURL + '/auth2/authorization/qq', '绑定QQ', 540, 540)
        window.addEventListener('message', this.loginSocial, false)
      },
      loginSocial(e) {
        const socialToken = e.data
        if (socialToken) {
          this.$store
            .dispatch('user/loginSocial', socialToken)
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
      margin: calc((100vh - 500px) / 2) 34% 30% 34%;
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
          .el-select {
            width: 90px;
            background-color: #fff;
          }
          .el-select__input {
            padding: 0 0 0 0;
            border-top-width: 0;
            border-left-width: 0;
            border-right-width: 0;
            border-bottom-width: 1px;
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
            height: 48px;
            padding: 0 0 0 0;
            border-top-width: 0;
            border-left-width: 0;
            border-right-width: 0;
            border-bottom-width: 1px;
            font-size: 15px;
            font-weight: 500;
          }
        }
      }
    }

    .tips {
      margin-bottom: 10px;
      font-size: $base-font-size-default;
      color: $base-color-white;

      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }

    .title-container {
      position: relative;

      .title {
        margin: 0 auto 40px auto;
        font-size: 34px;
        font-weight: bold;
        color: $base-color-blue;
        text-align: center;
      }
    }

    .svg-container {
      position: absolute;
      top: 14px;
      left: 15px;
      z-index: $base-z-index;
      font-size: 16px;
      color: #d7dee3;
      cursor: pointer;
      user-select: none;
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
