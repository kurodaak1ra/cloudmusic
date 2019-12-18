<template>
  <div class="login-page web-page">
    <div class="bg">
      <img src="../assets/img/login/logo.svg" alt="">
      <div class="wave">
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
    </div>
    <div class="main">
      <div class="btn">
        <div :class="registerTouch ? 'register-touch' : 'register'" @click="go('/cellphone')" @touchstart="registerTouch = true" @touchend="registerTouch = false">手机号登陆</div>
        <div :class="tryTouch ? 'try-touch' : 'try'" @click="go('/homepage')" @touchstart="loginTouch = true" @touchend="loginTouch = false">立即体验</div>
      </div>
      <div class="other-btn">
        <div @click="go('/description')">
          <img src="../assets/img/login/description.png" alt="">
        </div>
        <div @click="go('/update')">
          <img src="../assets/img/login/update.png" alt="">
        </div>
        <div @click="go('/email')">
          <img src="../assets/img/login/wy.png" alt="">
        </div>
      </div>
      <div ref="argument" class="argument">
        <input id="checkbox" v-model="checked" type="checkbox" :checked="checked">
        <label for="checkbox">同意<a href="https://music.163.com/html/web2/service.html" target="_blank">《用户协议》</a>和<a href="https://music.163.com/html/web2/privacy.html" target="_blank">《隐私政策》</a></label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      registerTouch: false,
      tryTouch: false,
      checked: false
    }
  },
  methods: {
    go(to) {
      if (!this.checked && !/description|update/.test(to)) {
        this.$refs.argument.classList.remove('argument-animation')
        setTimeout(() => { this.$refs.argument.classList.add('argument-animation') })
        this.$toast('请先勾选同意“用户协议“和”隐私政策“')
        return
      }
      this.$router.push({ path: to })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'slogan') return next(false)
    next()
  }
}
</script>

<style lang="scss">
.login-page {
  overflow-x: hidden;
  overflow-y: auto;
  background: #db2c1f;
  .bg {
    width: 750px;
    height: 750px;
    position: relative;
    img {
      width: 130px;
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 2;
      margin: -65px 0 0 -65px;
    }
    .wave {
      position: absolute;
      .circle {
        width: 750px;
        height: 750px;
        position: absolute;
        opacity: 0;
        border-radius: 50%;
        border: 3px solid #f22a25;
      }
      .circle:first-child {
        animation: circle-opacity 5s linear infinite;
      }
      .circle:last-child {
        animation: circle-opacity 5s linear infinite;
        animation-delay: 2s;
      }
      @keyframes circle-opacity {
        from {
          opacity: 1;
          transform: scale(0);
        }
        to {
          opacity: 0;
          transform: scale(1);
        }
      }
    }
  }
  .main {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 35px;
    .btn {
      text-align: center;
      padding: 0 60px;
      position: relative;
      z-index: 1;
      div {
        color: #fff;
        width: 100%;
        height: 75px;
        line-height: 75px;
        border-radius: 50PX;
        margin-bottom: 25px;
      }
      .register {
        color: #db2c1f;
        background: #fff;
      }
      .register-touch {
        color: #db2c1f;
        background: rgba(255, 255, 255, 0.9);
      }
      .try {
        color: #fff;
        background: transparent;
        border: 1.5px solid rgba(255, 255, 255, 0.3);
      }
      .try-touch {
        color: #fff;
        background: #e63434;
      }
    }
    .other-btn {
      display: flex;
      justify-content: space-between;
      padding: 50px 120px;
      div {
        width: 60px;
        p {
          font-size: 18px;
          line-height: 3em;
          text-align: center;
        }
      }
    }
    .argument {
      color: rgba(255, 255, 255, 0.4);
      font-size: 22px;
      text-align: center;
      input[type="checkbox"] {
        display: none;
      }
      input[type="checkbox"]:checked + label {
        background: url('../assets/img/login/checkbox.svg') no-repeat bottom left / 1em auto;
      }
      label {
        padding-left: 1.4em;
        background: url('../assets/img/login/checkbox.svg') no-repeat top left / 1em auto;
        a {
          color: rgba(255, 255, 255, 0.9);
        }
      }
    }
    .argument-animation {
      animation: shake 0.5s cubic-bezier(.36, .07, .19, .97) both;
    }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-5px, 0, 0); }
      40%, 60% { transform: translate3d(5px, 0, 0); }
    }
  }
}
</style>
