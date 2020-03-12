<template>
  <div class="login_container">
    <!-- 登录框 -->
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar">
        <img src="../assets/logo.png">
      </div>
      <!-- ref对象的引用 -->
      <el-form ref="loginResetRef" :model="loginForm" :rules="loginFormRules" class="login_form">
        <!-- 账号 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入账号"
                    prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" type="password"
                    prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-row class="btn">
          <el-button type="primary" @click="submitForm('loginResetRef')">登录</el-button>
          <el-button type="info" @click="formReset('loginResetRef')">重置</el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>export default {
  data () {
    return {
      // 登录表单绑定的数据
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          {
            required: true,
            message: '请输入账号',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    formReset (formName) {
      this.$refs[formName].resetFields()
    },
    submitForm (formName) {
      this.$refs[formName].validate(async valid => {
        // 先前端判断输入有效性
        if (valid) {
          // 接收对象 因为是promis，用await
          // 用data解构数据
          const { data: res } = await this.$http.post('login', this.loginForm)
          // console.log(res)
          // 后端根据status判断是否成功登录
          if (res.meta.status === 200) {
            alert('登录成功!')
          } else {
            alert('登录失败!')
          }
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login_box {
    height: 300px;
    width: 450px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }

  .avatar {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }

  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px 20px;
    box-sizing: border-box;
  }

  .btn {
    display: flex;
    justify-content: flex-end;
  }

</style>
