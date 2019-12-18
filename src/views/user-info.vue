<template>
  <div class="user-info-page web-page">
    <div class="nav">
      <div>
        <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
        <div>基本信息</div>
      </div>
    </div>
    <scroll ref="scroll" class="content" :up="getScrollUp()">
      <div v-if="data.allAuthTypes !== undefined" class="certification">
        <p class="title">认证信息</p>
        <div v-for="(i, index) in data.allAuthTypes" :key="index" class="auth-types">
          <img v-if="i.type === 300" src="../assets/img/user/png/committee.png" alt="">
          <img v-else src="../assets/img/user/star.svg" alt="">
          <p>{{i.desc}}</p>
        </div>
      </div>
      <div class="user-detail">
        <p class="title">个人信息</p>
        <div>
          <p class="level">等级：{{data.level}}</p>
          <p v-if="data.birthdayUnix > 0" class="age">年龄：{{ageExchange(data.birthday.year) + ' ' + constellation(data.birthday.month + '.' + data.birthday.day)}}</p>
          <p v-if="data.gender !== 0" class="gender">性别：{{data.gender === 1 ? '男' : '女'}}</p>
          <p v-if="prov !== 0" class="area">地区：{{(prov === '直辖市' ? '' : prov + ' ') + city}}</p>
          <p v-if="college.id !== 0 && !/9756/.test(college.id)" class="university">大学：{{college.name}}</p>
        </div>
      </div>
      <div class="introduction">
        <p class="title">个人介绍</p>
        <div>
          <p v-if="data.signature === ''" class="no">还没有填写个人介绍</p>
          <p v-else>{{data.signature}}</p>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
import scroll from './plugins/scroll'
import { getGLOBAL } from '../utils/store'
import { constellation, ageExchange } from '../utils/tools'
import { areaCodeApi, batchApi, userCollegeApi } from '../utils/api'

export default {
  name: 'user-info',
  components: { scroll },
  data() {
    return {
      // 方法
      constellation,
      ageExchange,
      // 数据
      data: {
        level: 0,
        signature: '',
        gender: 0,
        allAuthTypes: [],
        birthdayUnix: 0,
        birthday: {
          year: '1970',
          month: '01',
          day: '01'
        }
      },
      college: {
        id: 0,
        name: ''
      },
      prov: '',
      city: ''
    }
  },
  methods: {
    getScrollUp() {
      return {
        auto: true,
        callback: () => {
          this.init()
          this.userCollege()
        }
      }
    },

    // 初始化数据
    init() {
      batchApi({
        batch: 'user-detail',
        uid: getGLOBAL('user').id
      }).then(succ => {
        console.log('获取用户基本信息（success）：', succ)
        let suc = succ[`/api/v1/user/detail/${getGLOBAL('user').id}`]
        let date = new Date(suc.profile.birthday)
        this.data = {
          level: suc.level,
          signature: suc.profile.signature,
          gender: suc.profile.gender,
          allAuthTypes: suc.profile.allAuthTypes,
          birthdayUnix: suc.profile.birthday,
          birthday: {
            year: date.getFullYear(),
            month: date.getMonth() + 1,
            day: date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
          },
        }
        this.cityCode(suc.profile.province, suc.profile.city)
        // scroll 成功
        this.$refs.scroll.upEndSucc({ more: false })
      }).catch(err => {
        console.warn('获取用户基本信息（error）：', err)
        this.$refs.scroll.upEndErr()
      })
    },

    // 获取用户大学
    userCollege() {
      userCollegeApi({
        uid: 1308576494
      }).then(succ => {
        console.log('获取用户大学（success）：', succ)
        this.college = succ.college
      }).catch(err => {
        console.warn('获取用户大学（error）：', err)
      })
    },

    // 获取地区名
    cityCode(prov, city) {
      if (prov === 0) {
        this.prov = prov
        this.city = city
        return
      }
      areaCodeApi({
        prov: prov,
        city: city
      }).then(succ => {
        console.log('获取地区名（success）：', succ)
        this.prov = succ.prov
        this.city = succ.city
      }).catch(err => {
        console.warn('获取地区名（error）：', err)
      })
    }
  }
}
</script>

<style lang="scss">
.user-info-page {
  .nav {
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    div {
      font-size: 30px;
      display: flex;
      align-items: center;
      .back-icon {
        font-size: 35px;
        margin-right: 30px;
      }
    }
    span {
      font-size: 26px;
    }
  }
  .content {
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 28px;
    .certification, .user-detail, .introduction {
      margin-top: 25px;
      .title {
        font-weight: bold;
        line-height: 2.5em;
      }
    }
    .certification {
      .auth-types {
        display: flex;
        align-items: center;
        margin-bottom:15px;
        img {
          width: 40px;
        }
        p {
          color: #555;
          font-size: 22px;
          margin-left: 12px;
        }
      }
    }
    .user-detail, .introduction {
      div {
        p {
          color: #606060;
          line-height: 1.8em;
          font-size: 22px;
        }
      }
    }
  }
}
</style>