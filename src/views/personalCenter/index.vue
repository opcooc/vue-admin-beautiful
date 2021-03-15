<template>
  <div class="personalCenter-container">
    <div class="personalCenter-content-container">
      <el-tabs :value="tabName" :tab-position="tabPosition">
        <el-tab-pane name="information" label="个人资料">
          <h3 class="main-title">个人资料</h3>
          <div class="form-container">
            <div class="form-left-container">
              <el-form
                ref="userInfoForm"
                :model="userInfoForm"
                :rules="rules"
                :label-position="labelPosition"
                label-width="100px"
              >
                <el-form-item label="登录账号" prop="username">
                  <el-input
                    v-model="userInfoForm.username"
                    class="userInfoFormInput"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                  <el-input
                    v-model="userInfoForm.nickname"
                    class="userInfoFormInput"
                    placeholder="请输入昵称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                  <el-input
                    v-model="userInfoForm.mobile"
                    class="userInfoFormInput"
                    :disabled="true"
                  ></el-input>
                  <el-link
                    :underline="false"
                    type="primary"
                    @click="switchDialog('mobile')"
                  >
                    修改手机号
                  </el-link>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input
                    v-model="userInfoForm.email"
                    class="userInfoFormInput"
                    :disabled="true"
                  ></el-input>
                  <el-link
                    :underline="false"
                    type="primary"
                    @click="switchDialog('email')"
                  >
                    修改邮箱
                  </el-link>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                  <el-radio-group v-model="userInfoForm.gender">
                    <el-radio :label="0">男</el-radio>
                    <el-radio :label="1">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="个人简介" prop="description">
                  <el-input
                    v-model="userInfoForm.description"
                    placeholder="请输入描述"
                    type="textarea"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="submitUserInfoForm('userInfoForm')"
                  >
                    保存修改
                  </el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="form-right-container">
              <div style="margin: 0 auto; text-align: center">
                <label>头像</label>
                <div>
                  <el-avatar
                    class="user-avatar"
                    :src="userInfoForm.avatar"
                  ></el-avatar>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="email" label="邮箱管理">
          <h3 class="main-title">邮箱管理</h3>
        </el-tab-pane>
        <el-tab-pane name="social" label="第三方帐号绑定">
          <h3 class="main-title">第三方帐号绑定</h3>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        :title="dialogTitle"
        :visible.sync="centerDialogVisible"
        width="20%"
        destroy-on-close
        center
      >
        <el-steps :active="stepActive" align-center>
          <el-step title="身份验证"></el-step>
          <el-step title="更换信息"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
        <div class="mobile-verify-content">
          <MobileVerify
            v-show="chickMobile"
            ref="verify"
            :mobile-param="mobileParam"
            :confirm-button-name="confirmButtonName"
            :is-slider-verify="isSliderVerify"
            :captcha-type="captchaType"
            :user-id="verifyUserId"
            :is-disabled="isDisabled"
            :step-type="mobileVerifyStepType"
            @success="nextStep"
          ></MobileVerify>
          <div v-show="bindEmail" class="bind-email-content">
            <el-form
              ref="updateEmailForm"
              :model="updateEmailForm"
              :rules="rules"
              label-position="left"
            >
              <el-form-item prop="email">
                <el-input
                  v-model="updateEmailForm.email"
                  placeholder="邮箱"
                  type="text"
                ></el-input>
              </el-form-item>
              <el-form-item prop="code">
                <el-input
                  v-model.trim="updateEmailForm.code"
                  type="text"
                  placeholder="请输入 6 位邮箱验证码"
                ></el-input>
                <el-button
                  class="email-code"
                  :disabled="isSend"
                  @click="sendEmailCode"
                >
                  {{ emailCode }}
                </el-button>
              </el-form-item>
              <el-button
                size="medium"
                class="login-button"
                type="primary"
                @click="handleBindEmail"
              >
                确认更换
              </el-button>
            </el-form>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import { getUserDetails, simpleUpdateUser } from '@/api/user'
  import { mapGetters } from 'vuex'
  import MobileVerify from '@/components/MobileVerify'
  import { isEmail } from '@/utils/validate'

  export default {
    name: 'PersonalCenter',
    components: {
      MobileVerify,
    },
    data() {
      const validateEmail = (rule, value, callback) => {
        if (!isEmail(value)) {
          callback(new Error('请输入正确的邮箱'))
        } else {
          callback()
        }
      }
      return {
        tabName: 'information',
        tabPosition: 'left',
        labelPosition: 'right',
        centerDialogVisible: false,
        chickMobile: false,
        bindMobile: false,
        bindEmail: false,
        isSend: false,
        emailCode: '获取验证码',
        mobileVerifyStepType: '',
        confirmButtonName: '',
        isSliderVerify: false,
        verifyUserId: '',
        isDisabled: true,
        captchaType: 'slider',
        stepActive: 1,
        dialogTitle: '',
        userInfoForm: {
          username: '',
          nickname: '',
          gender: undefined,
          description: '',
          mobile: '',
          email: '',
          avatar: '',
        },
        mobileParam: '',
        updateEmailForm: {
          email: '',
          code: '',
        },
        rules: {
          nickname: [
            { required: true, message: '请输入昵称', trigger: 'change' },
            {
              min: 3,
              max: 10,
              message: '长度在 3 到 8 个字符',
              trigger: 'change',
            },
          ],
          gender: [
            { required: true, message: '性别不能为空', trigger: 'change' },
          ],
          email: [
            { required: true, trigger: 'blur', message: '请输入邮箱' },
            { validator: validateEmail, trigger: 'blur' },
          ],
          code: [
            { required: true, trigger: 'blur', message: '请输入邮箱证码' },
          ],
        },
      }
    },
    computed: {
      ...mapGetters({
        userId: 'user/userId',
      }),
    },
    created() {
      this.getUserInfo()
    },
    methods: {
      submitUserInfoForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let data = {
              id: this.userId,
              nickname: this.userInfoForm.nickname,
              avatar: this.userInfoForm.avatar,
              gender: this.userInfoForm.gender,
              description: this.userInfoForm.description,
            }
            simpleUpdateUser(data).then((response) => {
              if (response.code === 901) {
                this.getUserInfo()
                this.$baseMessage('修改成功', 'success')
              }
            })
          } else {
            return false
          }
        })
      },
      sendEmailCode(data) {
        if (!isEmail(this.updateEmailForm.email)) {
          this.$refs['updateEmailForm'].validateField('email')
          return
        }
        // reqMobileGet(data).then((res) => {
        //   if (res.code === 901) {
        //     this.isSend = true
        //     let n = res.data.expireIn
        //     this.getPhoneIntval = setInterval(() => {
        //       if (n > 0) {
        //         n--
        //         this.emailCode = '重新获取(' + n + 's)'
        //       } else {
        //         this.getPhoneIntval = null
        //         clearInterval(this.getPhoneIntval)
        //         this.emailCode = '获取验证码'
        //         this.isSend = false
        //       }
        //     }, 1000)
        //     this.phoneLoginForm.secretKey = res.data.secretKey
        //     this.phoneLoginForm.token = res.data.token
        //   }
        // })
      },
      switchDialog(type) {
        switch (type.toString()) {
          case 'mobile':
            this.dialogTitle = '修改手机号'
            this.mobileVerifyStepType = 'preMobile'
            break
          case 'email':
            this.dialogTitle = '修改邮箱'
            this.mobileVerifyStepType = 'preEmail'
            break
        }
        this.chickMobile = true
        this.bindEmail = false
        this.isDisabled = true
        this.isSliderVerify = false
        this.stepActive = 1
        this.confirmButtonName = '验证'
        this.verifyUserId = this.userId
        this.mobileParam = this.userInfoForm.mobile
        this.centerDialogVisible = true
      },
      nextStep(data) {
        switch (data.stepType.toString()) {
          case 'preMobile':
            if (this.stepActive === 2) {
              return this.handleBindMobile()
            } else {
              this.isSliderVerify = true
            }
            break
          case 'preEmail':
            this.chickMobile = false
            this.bindEmail = true
            break
        }
        this.isDisabled = false
        this.confirmButtonName = '确认更换'
        this.stepActive = 2
      },
      handleBindEmail() {
        this.centerDialogVisible = false
        this.getUserInfo()
      },
      handleBindMobile() {
        this.centerDialogVisible = false
        this.getUserInfo()
      },
      getUserInfo() {
        getUserDetails(this.userId).then((response) => {
          this.userInfoForm = response.data
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .personalCenter-container {
    .main-title {
      padding: 5px 5px 10px 5px;
      margin: 5px 5px 5px 5px;
      border-bottom: 1px solid rgba(34, 36, 38, 0.15);
    }
    .personalCenter-content-container {
      margin: 30px 20% 0 20%;
    }
    .mobile-verify-content {
      margin: 5px 5% 0 5%;
    }
    .bind-email-content {
      margin: 5px 5% 0 5%;
      .login-button {
        width: 100%;
        margin-top: 5px;
      }
      .email-code {
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
    .form-container {
      display: flex;
      .form-left-container {
        position: relative;
        display: inline-block;
        width: 75%;
        .userInfoFormInput {
          width: 75%;
          margin-right: 5%;
        }
      }
      .form-right-container {
        position: relative;
        display: inline-block;
        width: 25%;
        .user-avatar {
          width: 150px;
          height: 150px;
        }
      }
    }
  }
</style>
