<template>
  <div class="left-win">
    <div class="top">
      <div v-if="getGLOBAL('isLogin')" class="login">
        <div class="avatar" :style="{ backgroundImage: `url(${getGLOBAL('userInfo').avatarUrl}?imageView=1&thumbnail=115x0)` }" @click="goUser()"></div>
        <div>
          <div class="left" @click="goUser()">
            <span>{{getGLOBAL('userInfo').nickname}}</span>
            <img src="../../assets/img/window/left/icon.svg" alt="">
            <span>Lv.{{getGLOBAL('userInfo').level}}</span>
          </div>
          <span v-if="!getGLOBAL('userInfo').mobileSign" class="right signin-no" @click="signin()">&#xe657; 签到</span>
          <span v-else class="right signin-yes">已签到&#xe624;</span>
        </div>
      </div>
      <div v-else class="no_login">
        <p>登录网易云音乐</p>
        <p>手机电脑多端同步，尽享海量高品质音乐</p>
        <router-link to="/login">
          <span @click="$rmask()">立即登录</span>
        </router-link>
      </div>
      <ul class="mid-1">
        <li>
          <i v-if="false">4</i>
          <span class="icon">&#xe643;</span>
          <p class="txet">我的消息</p>
        </li>
        <li>
          <span>&#xe64b;</span>
          <p>我的好友</p>
        </li>
        <li>
          <span>&#xe64c;</span>
          <p>个性换肤</p>
        </li>
        <li>
          <span>&#xe654;</span>
          <p>听歌识曲</p>
        </li>
      </ul>
      <ul class="mid-2">
        <template v-for="(i, index) in list">
          <li v-if="i.show && i.type === 'in'" :key="index" @click="goPage(i.path)">
            <span v-html="i.icon"></span>
            <span>{{i.text}}</span>
          </li>
          <a v-if="i.show && i.type === 'out'" :key="index" :href="i.path" target="_blank">
            <span v-html="i.icon"></span>
            <span>{{i.text}}</span>
          </a>
        </template>
      </ul>
    </div>
    <div class="foot">
      <div v-if="getGLOBAL('isLogin')" @click="logout()">
        <span>&#xe66b;</span>
        <span>登出</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { getGLOBAL } from '../../utils/store'
import { logoutApi, dailySigninApi } from '../../utils/api'
import { goUser } from '../../utils/function'

export default {
  name: 'left-win',
  data() {
    return {
      // 方法
      getGLOBAL,
      // 数据
      list: [{
        icon: '&#xe671;',
        text: '项目说明',
        show: true,
        type: 'in',
        path: '/description'
      }, {
        icon: '&#xe671;',
        text: '更新说明',
        show: true,
        type: 'in',
        path: '/update'
      }, {
        icon: '&#xe671;',
        text: '客户端下载',
        show: true,
        type: 'out',
        path: 'https://music.163.com/#/download'
      }, {
        icon: '&#xe671;',
        text: '测试页面',
        show: true,
        type: 'in',
        path: '/test'
      }]
    }
  },
  created() {
    this.$mask()
  },
  methods: {
    ...mapMutations([
      'SET_GLOBAL',
      'SET_WINDOWS',
      'SET_PAGE_DATA'
    ]),

    // 签到
    signin() {
      this.$rmask()
      dailySigninApi({
        type: 0   // 0: 安卓端签到 1: web/pc端签到 默认0
      }).then(succ => {
        console.log('签到（success）：', succ)
        this.$toast(`签到成功，经验+${succ.point}点`)
        this.SET_PAGE_DATA(['userInfo', 'mobileSign', true])
      }).catch(err => {
        console.warn('签到（error）：', err)
      })
    },

    // 登出
    logout() {
      this.$rmask()
      logoutApi().then(succ => {
        console.log('登出（success）：', succ)
        location.reload()
      }).catch(err => {
        console.warn('登出（error）：', err)
      })
    },

    // 跳个人页
    goUser() {
      this.$rmask()
      goUser(getGLOBAL('userInfo').uid)
    },

    // 跳其他页
    goPage(res) {
      this.$rmask()
      this.$router.push({ path: res })
    }
  }
}
</script>

<style lang="scss">
.left-win {
  width: 640px;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 11;
  overflow: auto;
  background: #fff;
  .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 80px;
    overflow: auto;
    .login {
      height: 260px;
      background: linear-gradient(#fff , #f5f6f6);
      padding: 0 35px 25px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      .avatar {
        width: 115px;
        height: 115px;
        border-radius: 50%;
        background: no-repeat center center / cover;
      }
      >div:last-child {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 12px;
        .left {
          display: flex;
          align-items: center;
          span:first-child {
            font-size: 27px;
          }
          img {
            width: 27px;
            height: 27px;
            margin: 0 8px;
          }
          span:last-child {
            color: #808080;
            width: 55px;
            height: 27px;
            line-height: 27px;
            text-align: center;
            font-size: 15px;
            font-weight: bold;
            font-style: italic;
            border-radius: 50PX;
            background: rgba(0, 0, 0, 0.05);
          }
        }
        .right {
          width: 115px;
          height: 45px;
          line-height: 45px;
          text-align: center;
          font-size: 22px;
          border-radius: 50PX;
        }
        .signin-no {
          color: #fff;
          background: linear-gradient(to right, #ff613e , #ff3333);
        }
        .signin-yes {
          color: #808080;
          border: 1.5px solid #808080;
        }
      }
    }
    .no_login {
      color: #515151;
      height: 260px;
      font-size: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(#fff , #f5f6f6);
      a {
        color: #515151;
        width: 210px;
        height: 50px;
        border-radius: 50PX;
        border: 1.5px solid rgba(0, 0, 0, 0.1);
        background: transparent;
        margin-top: 35px;
        text-align: center;
        line-height: 50px;
        span {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .mid-1 {
    height: 160px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 55px;
    border-bottom: 1.5px solid #f5f5f5;
    li {
      text-align: center;
      position: relative;
      i {
        color: #fff;
        width: 28px;
        height: 28px;
        position: absolute;
        top: -10px;
        right: -5px;
        border-radius: 50%;
        background: #ff3a3a;
        text-align: center;
        line-height: 28px;
        font-size: 15px;
        font-style: normal;
      }
      span {
        color: #ff3a3a;
        font-size: 42px;
      }
      p {
        margin-top: 15px;
      }
    }
  }
  .mid-2 {
    padding: 0 35px;
    li, a {
      color: #333;
      height: 80px;
      display: flex;
      align-items: center;
      span {
        vertical-align: middle;
      }
      span:first-child {
        color: #9d9d9d;
        margin-right: 20px;
        font-size: 35px;
      }
    }
    li:nth-child(2) {
      border-bottom: 1.5px solid #f5f5f5;
    }
  }
  .foot {
    padding: 0 20px;
    text-align: center;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    border-top: 1.5px solid #f5f5f5;
    div {
      display: flex;
      align-items: center;
      line-height: 80px;
      span:first-child {
        font-size: 33px;
        margin-right: 20px;
      }
    }
  }
}
</style>

