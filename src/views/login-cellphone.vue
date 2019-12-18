<template>
  <div class="login-cellphone-page web-page">
    <!-- nav -->
    <div class="nav">
      <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
      <span>{{navText}}</span>
    </div>
    <!-- 电话页 -->
    <div v-if="page_1" class="cellphone-page">
      <p class="tips">未注册手机号登录后将自动创建账号</p>
      <div class="cellphone">
        <span :style="{ color: cellphone === '' || cellphone === null ? '#c8c8c8' : '#333' }">+86</span>
        <input v-model="cellphone" type="number" placeholder="请输入手机号" @input="phoneInputType" @keyup.enter="cellphonePage()">
        <span v-if="cellphone !== ''" @click="cellphone = null">&#xe62b;</span>
      </div>
      <button class="submit" @click="cellphonePage()">下一步</button>
    </div>
    <!-- 输入密码 -->
    <div v-if="page_2" class="password-page">
      <div class="password">
        <input v-model="password" type="password" placeholder="请输入密码" autofocus="autofocus" maxlength="20" @keyup.enter="passworsPage()">
        <a href="http://reg.163.com/naq/findPassword#/verifyAccount" target="_blank">忘记密码？</a>
      </div>
      <button class="submit" @click="passworsPage()">下一步</button>
    </div>
    <!-- 验证码页 -->
    <div v-if="page_3" class="code-page">
      <div class="top">
        <p>验证码已发送至</p>
        <div>
          <span>+86 {{tel}}</span>
          <span v-if="count !== 0">{{count}}s</span>
          <span v-else style="color: #507daf" @click="captchaSent()">重新获取</span>
        </div>
      </div>
      <div class="captcha">
        <input ref="captcha" v-model="captcha" type="number" autofocus="autofocus" @input="codeInputType">
        <div>
          <span>{{captchaArr[0]}}</span>
          <transition name="trans">
            <i v-if="captchaArr[0] !== ''"></i>
          </transition>
        </div>
        <div>
          <span>{{captchaArr[1]}}</span>
          <transition name="trans">
            <i v-if="captchaArr[1] !== ''"></i>
          </transition>
        </div>
        <div>
          <span>{{captchaArr[2]}}</span>
          <transition name="trans">
            <i v-if="captchaArr[2] !== ''"></i>
          </transition>
        </div>
        <div>
          <span>{{captchaArr[3]}}</span>
          <transition name="trans">
            <i v-if="captchaArr[3] !== ''"></i>
          </transition>
        </div>
      </div>
    </div>
    <!-- 设置密码 -->
    <div v-if="page_4" class="password-set-page">
      <div class="password">
        <input v-model="passwordSet" type="password" placeholder="设置登录密码，不少于6位" maxlength="20" autofocus="autofocus" @keyup.enter="passworsSetPage()">
      </div>
      <button class="submit" @click="passworsSetPage()">下一步</button>
    </div>
    <!-- 昵称页 -->
    <div v-if="page_5" class="nickname-page">
      <div class="top-img">
        <img src="../assets/img/login/hi.png" alt="">
        <p>你希望大家怎么称呼你呢？</p>
      </div>
      <div class="main">
        <div class="nickname">
          <input v-model="nickname" type="text" placeholder="请输入昵称" maxlength="30" autofocus="autofocus" @keyup.enter="nicknamePage()">
          <span v-if="nickname !== ''" @click="nickname = ''">&#xe62b;</span>
        </div>
        <button @click="nicknamePage()">开启云音乐</button>
      </div>
      <div class="btm">
        <input v-model="checked" type="checkbox" :checked="checked ? 'checked' : ''">
        <span @click="checked = !checked">同意以下协议</span>
        <a href="https://music.163.com/html/web2/service.html" target="_blank">《网易云音乐服务条款》</a>
      </div>
    </div>
  </div>
</template>

<script>
import { cellphoneExistenceCheckApi, activateInitProfileApi, captchaSentApi, captchaVerifyApi, registerCellphoneApi, loginCellphoneApi, visitorsApi } from '../utils/api'

export default {
  name: 'login-cellphone',
  data() {
    return {
      page_1: true,
      page_2: false,
      page_3: false,
      page_4: false,
      page_5: false,
      navText: '手机号登录',
      inputType: 0,
      isRegister: false,
      // 电话页
      cellphone: '',
      // 密码页
      password: '',
      // 验证码页
      tel: '',
      count: 60,
      captcha: '',
      captchaArr: ['', '', '', ''],
      // 设置登录密码页
      passwordSet: '',
      // 昵称页
      nickname: '',
      checked: true
    }
  },
  watch: {
    cellphone(newer, older) {
      if (newer === null) return
      let tempPhone = newer
      // 手机号限制11位
      if (this.inputType === 'insertText' && tempPhone.length === 0) tempPhone = older
      if (tempPhone.length > 11) {
        this.cellphone = tempPhone.slice(0, 11)
      } else {
        this.cellphone = tempPhone
      }
    },
    captcha(newer, older) {
      if (newer === null) return
      let tempCaptcha = newer
      if (this.inputType === 'insertText' && tempCaptcha.length === 0) tempCaptcha = older
      if (tempCaptcha.length > 4) {
        this.captcha = tempCaptcha.slice(0, 4)
      } else {
        this.captcha = tempCaptcha
      }
      // 逻辑
      let tempCaptchaArr = []
      let captchaSplit = this.captcha.split('')
      for (let i = 0; i < 4; i++) {
        if (i < captchaSplit.length) {
          tempCaptchaArr.push(captchaSplit[i])
        } else {
          tempCaptchaArr.push('')
        }
      }
      this.captchaArr = tempCaptchaArr
    }
  },
  methods: {
    // 输入类型
    phoneInputType(res) {
      this.inputType = res.inputType
    },
    codeInputType(res) {
      this.inputType = res.inputType
      setTimeout(() => {
        if (this.captchaArr[3] === '') return
        this.$refs.captcha.blur()
        // loading
        this.$loading()
        // 验证 {验证码} 有效性
        captchaVerifyApi({
          phone: this.cellphone,
          captcha: this.captcha
        }).then(succ => {
          console.log('注册（success）：', succ)
          this.$rloading()
          this.page_1 = this.page_3 = this.page_5 = false
          this.page_4 = true
          this.navText = '手机号注册'
        }).catch(err => {
          console.warn('注册（error）：', err)
          this.$rloading()
          this.captcha = null
          this.captchaArr = ['', '', '', '']
        })
      })
    },

    // 电话号码页
    cellphonePage() {
      if (this.cellphone.length !== 11) {
        this.$toast('请输入11位数字的手机号')
        return
      }
      if (!/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|16[2|5|6|7]|17[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9]|19[1|8|9])\d{8}$/.test(this.cellphone)) {
        this.$toast('手机号码格式错误')
        return
      }
      this.$loading()
      // 验证是否注册
      cellphoneExistenceCheckApi({
        cellphone: this.cellphone
      }).then(succ => {
        console.log('是否注册（success）：', succ)
        this.$rloading()
        if (succ.exist !== -1) {
          this.isRegister = true
          this.page_1 = false
          this.page_2 = true
        } else {
          this.isRegister = false
          this.tel = this.cellphone.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2')
          this.navText = '手机号验证'
          this.page_1 = this.page_4 = this.page_5 = false
          this.page_3 = true
          this.captchaSent()
        }
      }).catch(err => {
        console.warn('是否注册（error）：', err)
        this.$rloading()
      })
    },

    // 密码页
    passworsPage() {
      if (this.password === '') {
        this.$toast('请输入密码')
        return
      }
      this.$loading()
      this.loginText = '登录中...'
      loginCellphoneApi({
        phone: this.cellphone,
        password: this.password
      }).then(succ => {
        console.log('手机号登录（success）：', succ)
        visitorsApi({ id: 1 })
        location.reload()
      }).catch(err => {
        console.warn('手机号登录（error）：', err)
        this.$rloading()
        this.loginText = '登录'
      })
    },

    // 设置登录密码页
    passworsSetPage() {
      if (this.passwordSet.length < 6) {
        this.$toast('密码长度不足6位')
        return
      }
      this.page_1 = this.page_3 = this.page_4 = false
      this.page_5 = true
    },

    // 昵称页
    nicknamePage() {
      if (this.nickname.replace(/[^\x00-\xff]/g, '**').length) {
        this.$toast('昵称不能少于2个汉字或4个字符')
        return
      }
      if (!this.checked) {
        this.$toast('请先同意《网易云音乐服务条款》')
        return
      }

      this.$loading()
      activateInitProfileApi({
        nickname: this.nickname
      }).then(succ => {
        console.log('用户名验证（success）：', succ)
        this.$rloading()
        if (succ.code === 407) {
          this.$toast(succ.msg)
          return
        }
        // 注册
        this.registerCellphone()
      }).catch(err => {
        console.warn('用户名验证（error）：', err)
        this.$rloading()
      })
    },

    // 注册
    registerCellphone() {
      this.$loading()
      registerCellphoneApi({
        phone: this.cellphone,
        captcha: this.captcha,
        password: this.passwordSet,
        nickname: this.nickname
      }).then(succ => {
        console.log('注册（success）：', succ)
        location.reload()
      }).catch(err => {
        console.warn('注册（error）：', err)
        this.$rloading()
      })
    },

    // 获取验证码
    captchaSent() {
      this.$loading()
      captchaSentApi({
        phone: this.cellphone
      }).then(succ => {
        console.log('发送验证码（success）：', succ)
        this.$rloading()
        this.navText = '手机号验证'
        this.password = ''
        this.count = 60
        this.countDown()
      }).catch(err => {
        console.warn('发送验证码（error）：', err)
        this.$rloading()
      })
    },

    // 倒计时
    countDown() {
      if (this.count <= 0) return
      setTimeout(() => {
        this.count--
        this.countDown()
      }, 1000)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.isRegister) {
      if (this.page_2) {
        this.page_2 = false
        this.page_1 = true
        this.password = ''
        return next(false)
      }
    } else {
      if (this.page_3) {
        this.page_3 = this.page_4 = this.page_5 = false
        this.page_1 = true
        this.navText = '手机号登录'
        this.password = ''
        return next(false)
      } else if (this.page_4) {
        this.page_1 = this.page_4 = this.page_5 = false
        this.page_3 = true
        this.navText = '手机号验证'
        this.captcha = ''
        this.captchaArr = ['', '', '', '']
        return next(false)
      } else if (this.page_5) {
        this.page_1 = this.page_3 = this.page_5 = false
        this.page_4 = true
        this.navText = '手机号注册'
        return next(false)
      }
    }
    next()
  }
}
</script>

<style lang="scss">
.login-cellphone-page {
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
  .cellphone-page, .password-page, .code-page, .password-set-page {
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding: 0 28px;
  }
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
  .cellphone-page {
    .tips {
      color: #999;
      margin: 55px 0;
    }
    .cellphone {
      height: 80px;
      margin-bottom: 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1.5px solid #f5f5f5;
      span:first-child {
        font-size: 30px;
        flex-shrink: 0;
        margin-right: 15px;
      }
      span:last-child {
        color: #c8c8c8;
        font-size: 23px;
      }
    }
    .submit {
      color: #fff;
      width: 100%;
      height: 75px;
      border-radius: 50PX;
      font-size: 30px;
      background: #ff3a3a;
    }
  }
  .password-page {
    .password {
      height: 80px;
      margin: 75px 0 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1.5px solid #f5f5f5;
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
      font-size: 30px;
      background: #ff3a3a;
    }
  }
  .code-page {
    .top {
      color: #212121;
      margin-top: 75px;
      p {
        font-size: 30px;
        line-height: 80px;
      }
      div {
        color: #909090;
        display: flex;
        justify-content: space-between;
      }
    }
    .captcha {
      margin: 80px 110px 0;
      position: relative;
      display: flex;
      justify-content: space-between;
      input {
        position: absolute;
        z-index: 1;
        opacity: 0;
      }
      div {
        position: relative;
        span {
          display: block;
          width: 80px;
          height: 80px;
          font-size: 35px;
          text-align: center;
          line-height: 80px;
          border-bottom: 2PX solid #e5e5e5;
        }
        i {
          width: 100%;
          height: 2PX;
          position: absolute;
          left: 0;
          bottom: 0;
          background: #212121;
        }
        .trans-enter-active {
          animation: trans .15s;
        }
        .trans-leave-active {
          animation: trans .15s reverse;
        }
        @keyframes trans {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      }
    }
  }
  .password-set-page {
    .password {
      height: 80px;
      margin: 75px 0 70px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1.5px solid #f5f5f5;
    }
    .submit {
      color: #fff;
      width: 100%;
      height: 75px;
      border-radius: 50PX;
      font-size: 30px;
      background: #ff3a3a;
    }
  }
  .nickname-page {
    .top-img {
      img {
        width: 120px;
        margin: 0 auto;
      }
      p {
        text-align: center;
      }
    }
    .main {
      margin-top: 60px;
      .nickname {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1.5px solid #f5f5f5;
        span {
          color: #c8c8c8;
          font-size: 23px;
        }
      }
      button {
        color: #fff;
        width: 100%;
        height: 75px;
        border-radius: 50PX;
        margin-top: 70px;
        font-size: 30px;
        background: #ff3a3a;
      }
    }
    .btm {
      display: flex;
      align-items: center;
      margin-top: 35px;
      input {
        width: unset;
        height: unset;
        margin-right: 0.5em;
      }
      a {
        color: #4c7aae;
      }
    }
  }
}
</style>
