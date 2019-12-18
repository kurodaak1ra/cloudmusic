<template>
  <dir class="slogan web-page">
    <div v-if="!show" class="default">
      <img src="../assets/img/slogan/slogan.png" alt="">
      <img src="../assets/img/slogan/cloud-music.png" alt="">
    </div>
    <div v-else class="cover">
      <div class="main-cover" :style="{ backgroundImage: `url(${pic})` }"></div>
      <span class="skip" @click="go()">跳过</span>
      <div class="logo">
        <img src="../assets/img/slogan/logo.png" alt="">
      </div>
    </div>
  </dir>
</template>

<script>
import { mapMutations } from 'vuex'
import { getGLOBAL } from '../utils/store'
import { imgToBlob } from '../utils/tools'
import { sloganAdvApi, visitorsApi, loginStatusApi, batchApi, likeListApi } from '../utils/api'

export default {
  name: 'slogan',
  data() {
    return {
      pic: getGLOBAL('1px')['eeeeee'],
      show: false
    }
  },
  created() {
    this.sloganAdv()
    this.loginStatus()
  },
  methods: {
    ...mapMutations([
      'SET_GLOBAL'
    ]),

    // 获取广告
    sloganAdv() {
      sloganAdvApi().then(succ => {
        console.log('获取广告（success）：', succ)
        this.show = succ.show
        if (succ.show) {
          imgToBlob(succ.pic, res => { this.pic = res })
          setTimeout(() => { this.go() }, 5000)
        } else {
          setTimeout(() => { this.go() }, 3000)
        }
      }).catch(err => {
        console.warn('获取广告（error）：', err)
        setTimeout(() => { this.go() }, 3000)
      })
    },

    // 登录状态
    loginStatus() {
      loginStatusApi({
        timestamp: new Date().getTime()
      }).then(succ => {
        console.log('获取登录状态（success）：', succ)
        // 获取用户详细信息
        this.userDetail(succ.profile.userId)
        // 获取喜欢的音乐
        this.likeList(succ.profile.userId)
      }).catch(err => {
        console.warn('获取登录状态（error）：', err)
      })
    },

    // 获取用户详细信息
    userDetail(id) {
      batchApi({
        batch: 'user-detail',
        uid: id
      }).then(succ => {
        console.log('获取用户详情（success）：', succ)
        // 登录状态变更
        this.SET_GLOBAL(['isLogin', true])
        // 设置用户信息
        this.SET_GLOBAL(['userInfo', {
          uid: succ[`/api/v1/user/detail/${id}`].profile.userId,
          nickname: succ[`/api/v1/user/detail/${id}`].profile.nickname,
          gender: succ[`/api/v1/user/detail/${id}`].profile.gender,
          birthday: succ[`/api/v1/user/detail/${id}`].profile.birthday,
          province: succ[`/api/v1/user/detail/${id}`].profile.province,
          signature: succ[`/api/v1/user/detail/${id}`].profile.signature,
          city: succ[`/api/v1/user/detail/${id}`].profile.city,
          level: succ[`/api/v1/user/detail/${id}`].level,
          pcSign: succ[`/api/v1/user/detail/${id}`].pcSign,
          avatarUrl: succ[`/api/v1/user/detail/${id}`].profile.avatarUrl,
          backgroundUrl: succ[`/api/v1/user/detail/${id}`].profile.backgroundUrl,
        }])
      }).catch(err => {
        console.warn('获取用户详情（error）：', err)
      })
    },

    // 获取喜欢的歌曲 list
    likeList(id) {
      likeListApi().then(succ => {
        console.log('喜欢的歌曲（success）：', succ)
        this.SET_GLOBAL(['likeList', succ.hasOwnProperty('ids') ? succ.ids : []])
      }).catch(err => {
        console.warn('喜欢的歌曲（error）：', err)
      })
    },

    // go
    go() {
      if (this.$store.state.GLOBAL.isLogin) {
        this.$router.push({ path: '/homepage' })
        visitorsApi({ id: 1 })  // 访客登记
      } else {
        this.$router.push({ path: '/login' })
        visitorsApi({ id: 0 })  // 访客登记
      }
    }
  }
}
</script>

<style lang="scss">
.slogan {
  .default {
    height: 100%;
    background: #db2c1f;
    img:first-child {
      width: 380px;
      margin: 0 auto;
      padding-top: 320px;
    }
    img:last-child {
      width: 170px;
      position: absolute;
      left: 50%;
      bottom: 40px;
      margin-left: -85px;
    }
  }
  .cover {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .main-cover {
      height: 100%;
      transition: background-image .3s;
      background: no-repeat center center / cover;
    }
    .skip {
      color: #fff;
      width: 5em;
      position: absolute;
      right: 17px;
      bottom: 180px;
      line-height: 2.3em;
      text-align: center;
      border-radius: 50PX;
      background: rgba(0, 0, 0, 0.3);
    }
    .logo {
      width: 300px;
      height: 145px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      p {
        color: #b0b0b0;
        text-align: center;
        font-size: 15px;
      }
    }
  }
}
</style>
