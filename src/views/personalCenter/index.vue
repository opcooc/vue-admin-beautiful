<template>
  <div class="personalCenter-container">
    <el-tabs :tab-position="tabPosition">
      <el-tab-pane label="我的消息">
        <h3 class="main-title">我的消息</h3>
        <div class="form-container">
          <div class="form-left-container">
            <el-form
              ref="ruleForm"
              :model="ruleForm"
              :rules="rules"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="活动名称" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
              </el-form-item>
              <el-form-item label="活动区域" prop="region">
                <el-select
                  v-model="ruleForm.region"
                  placeholder="请选择活动区域"
                >
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="即时配送" prop="delivery">
                <el-switch v-model="ruleForm.delivery"></el-switch>
              </el-form-item>
              <el-form-item label="活动性质" prop="type">
                <el-checkbox-group v-model="ruleForm.type">
                  <el-checkbox
                    label="美食/餐厅线上活动"
                    name="type"
                  ></el-checkbox>
                  <el-checkbox label="地推活动" name="type"></el-checkbox>
                  <el-checkbox label="线下主题活动" name="type"></el-checkbox>
                  <el-checkbox label="单纯品牌曝光" name="type"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="特殊资源" prop="resource">
                <el-radio-group v-model="ruleForm.resource">
                  <el-radio label="线上品牌商赞助"></el-radio>
                  <el-radio label="线下场地免费"></el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="活动形式" prop="desc">
                <el-input v-model="ruleForm.desc" type="textarea"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">
                  立即创建
                </el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="form-right-container">
            <div style="margin: 0 auto; text-align: center">
              <label>头像</label>
              <div>
                <el-avatar
                  class="user-avatar"
                  :src="ruleForm.avatar"
                ></el-avatar>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="修改个人资料">
        <h3 class="main-title">修改个人资料</h3>
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
</template>

<script>
  export default {
    name: 'PersonalCenter',
    data() {
      return {
        tabPosition: 'left',
        ruleForm: {
          name: '',
          region: '',
          delivery: false,
          type: [],
          resource: '',
          desc: '',
          avatar: '',
        },
        rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            {
              min: 3,
              max: 5,
              message: '长度在 3 到 5 个字符',
              trigger: 'blur',
            },
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' },
          ],
          type: [
            {
              type: 'array',
              required: true,
              message: '请至少选择一个活动性质',
              trigger: 'change',
            },
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' },
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' },
          ],
        },
      }
    },
    created() {},
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
    .form-container {
      display: flex;
      .form-right-container {
        position: relative;
        display: inline-block;
        width: 75%;
        padding-left: 1rem;
        vertical-align: top;
      }
      .form-right-container {
        position: relative;
        display: inline-block;
        width: 25%;
        padding-left: 1rem;
        vertical-align: top;
        .user-avatar {
          width: 150px;
          height: 150px;
          text-align: center;
          cursor: pointer;
          border-radius: 50%;
        }
      }
    }
  }
</style>
