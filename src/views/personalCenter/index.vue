<template>
  <div class="personalCenter-container">
    <div class="personalCenter-content-container">
      <el-tabs :tab-position="tabPosition">
        <el-tab-pane label="修改个人资料">
          <h3 class="main-title">修改个人资料</h3>
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
                  <el-link :underline="false" type="primary">
                    修改手机号
                  </el-link>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input
                    v-model="userInfoForm.email"
                    class="userInfoFormInput"
                    :disabled="true"
                  ></el-input>
                  <el-link :underline="false" type="primary">修改邮箱</el-link>
                </el-form-item>
                <el-form-item label="性别" prop="gender">
                  <el-radio-group v-model="userInfoForm.gender">
                    <el-radio :label="0">男</el-radio>
                    <el-radio :label="1">女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="描述" prop="description">
                  <el-input
                    v-model="userInfoForm.description"
                    placeholder="请输入描述"
                    type="textarea"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="submitForm('userInfoForm')">
                    保存修改
                  </el-button>
                  <el-button @click="resetForm('userInfoForm')">重置</el-button>
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
        <el-tab-pane label="修改登录密码">
          <h3 class="main-title">修改登录密码</h3>
        </el-tab-pane>
        <el-tab-pane label="修改登录邮箱">
          <h3 class="main-title">修改登录邮箱</h3>
        </el-tab-pane>
        <el-tab-pane label="邮件提醒设置">
          <h3 class="main-title">邮件提醒设置</h3>
        </el-tab-pane>
        <el-tab-pane label="第三方帐号绑定">
          <h3 class="main-title">第三方帐号绑定</h3>
        </el-tab-pane>
        <el-tab-pane label="手机绑定设置">
          <h3 class="main-title">手机绑定设置</h3>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import { getUserDetails } from '@/api/user'
  import { mapGetters } from 'vuex'

  export default {
    name: 'PersonalCenter',
    data() {
      return {
        tabPosition: 'left',
        labelPosition: 'right',
        userInfoForm: {
          username: '',
          nickname: '',
          gender: '',
          description: '',
          mobile: '',
          email: '',
          avatar: '',
        },
        rules: {
          username: [
            { required: true, message: '请输入登录账户', trigger: 'blur' },
            {
              min: 3,
              max: 10,
              message: '长度在 3 到 10 个字符',
              trigger: 'blur',
            },
          ],
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
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!')
          } else {
            return false
          }
        })
      },
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      getUserInfo() {
        getUserDetails(this.userId).then((response) => {
          this.userInfoForm.username = response.data.username
          this.userInfoForm.nickname = response.data.nickname
          this.userInfoForm.gender = response.data.gender
          this.userInfoForm.description = response.data.description
          this.userInfoForm.mobile = response.data.mobile
          this.userInfoForm.email = response.data.email
          this.userInfoForm.avatar = response.data.avatar
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
