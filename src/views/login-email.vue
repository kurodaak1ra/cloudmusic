<template>
  <div class="login-email-page web-page">
    <div class="nav">
      <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
      <span>网易邮箱账号登录</span>
    </div>
    <div class="email">
      <input v-model="email" type="text" autofocus="autofocus" placeholder="请输入邮箱账号" maxlength="50" @keyup.enter="login()">
      <span v-if="email !== ''" @click="email = ''">&#xe62b;</span>
    </div>
    <div class="password">
      <input v-model="password" type="password" placeholder="请输入密码" maxlength="20" @keyup.enter="login()">
      <a href="http://reg.163.com/naq/findPassword#/verifyAccount" target="_blank">忘记密码？</a>
    </div>
    <button class="submit" @click="login()">{{loginText}}</button>
  </div>
</template>

<script>
import { loginEmailApi, visitorsApi } from '../utils/api'

export default {
  name: 'login-email',
  data() {
    return {
      loginText: '登录',
      email: '',
      password: ''
    }
  },
  methods: {
    login() {
      // 邮箱正则验证
      if (this.email === '') {
        this.$toast('请输入邮箱')
        return
      } else if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(this.email)) {
        this.$toast('邮箱格式错误')
        return
      }
      // 密码验证
      if (this.password === '') {
        this.$toast('请输入密码')
        return
      }

      this.$loading()
      this.loginText = '登录中...'
      loginEmailApi({
        'email': this.email,
        'password': this.password
      }).then(succ => {
        console.log('登录（success）：', succ)
        visitorsApi({ id: 1 })
        location.reload()
      }).catch(err => {
        console.warn('登录（error）：', err)
        this.loginText = '登录'
        this.$rloading()
      })
    }
  }
}
</script>

<style lang="scss">
.login-email-page {
  padding: 0 28px;
  .nav {
    height: 90px;
    font-size: 30px;
    line-height: 90px;
    .back-icon {
      font-size: 35px;
      margin-right: 30px;
    }
  }
  .email, .password {
    height: 80px;
    margin: 55px auto 0;
    border-bottom: 1.5px solid #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: space-between;
    input {
      font-size: 30px;
    }
    input::-webkit-input-placeholder {
      color: #c8c8c8;
    }
    input:-moz-placeholder {
      color: #c8c8c8;
    }
    input::-moz-placeholder {
      color: #c8c8c8;
    }
    input:-ms-input-placeholder {
      color: #c8c8c8;
    }
  }
  .email {
    margin-top: 85px;
    span:last-child {
      color: #c8c8c8;
      font-size: 23px;
      margin-left: 1em;
    }
  }
  .password {
    a {
      color: #507daf;
      font-size: 22px;
      margin-left: 1em;
      white-space: nowrap;
    }
  }
  .submit {
    color: #fff;
    width: 100%;
    height: 75px;
    border-radius: 50PX;
    margin-top: 70px;
    font-size: 30px;
    background: #ff3a3a;
  }
}
</style>
