<template>
  <div class="loginbox">
    <div class="imgbox">
      <img src="../assets/heben.jpeg" alt="">
    </div>
    <el-card>
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="demo-ruleForm">
        <el-form-item prop="username" style="margin-top: 50px;">
          <el-input v-model="loginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" prefix-icon="el-icon-lock" show-password></el-input>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="logininfo" style="margin-left: 200px;">登录</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {

  },
  data() {
    // 密码校验   6-12位的字母或者数字  ^[a-zA-Z0-9]{6,12}$
    var reg = /^[a-zA-Z0-9]{6,12}$/;
    var vpwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (!reg.test(value)) {
          callback(new Error('请输入6-12位的字母或数字'));
        }
        callback();
      }
    };
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginRules: {
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' },
        { min: 3, max: 6, message: '长度在 3 到 5 个字符', trigger: 'blur' }],
        password: [{ required: true, validator: vpwd, trigger: 'blur' }]
      },


    };
  },
  methods: {
    // 确定登录
    logininfo() {
      // 预校验成功值进行存储
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        //  发送请求  拿到token  并存储到sessionStorage中
        let { data: res } = await this.axios.post('/login', this.loginForm);
        if (res.meta.status != 200) return this.message.error('请求登录失败');
        // console.log(res);
        // console.log(res.token);
        sessionStorage.setItem('token', res.data.token);
        this.$router.push('/home/welcome');
      })

    },
    // 重置按钮
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    }
  },
  components: {

  },
};
</script>

<style scoped lang="less">
.loginbox {
  width: 100%;
  height: 100%;
  background: url(../assets/bj.jpg) no-repeat;
  background-size: cover;
  // display: flex;
  // align-items: center;
  // justify-content: center;
  // flex-direction: column;
  position: relative;
  overflow: hidden;

  .imgbox {
    width: 110px;
    height: 110px;
    border-radius: 100%;
    // background-color: aquamarine;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 160px;
    z-index: 10;

    box-shadow: 0 0 5px #ddd;

    img {
      width: 100%;
      height: 100%;
      border-radius: 100%;
    }
  }

  .el-card {
    width: 420px;
    height: 280px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    // align-items: center;
    justify-content: center;

    .el-form {
      .el-input {
        width: 350px;


      }
    }
  }
}
</style>
