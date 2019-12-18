<template>
  <div class="my-detail-page web-page">
    <div class="nav">
      <div>
        <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
        <div>我的资料</div>
      </div>
    </div>
    <ul class="main">
      <li class="line"></li>
      <li>
        <div>头像</div>
        <div class="avatar" :style="{ backgroundImage: `url(${getGLOBAL('userInfo').avatarUrl}?imageView=1&thumbnail=40x0)` }"></div>
      </li>
      <li>
        <div>个人主页背景</div>
        <div class="bg" :style="{ backgroundImage: `url(${getGLOBAL('userInfo').backgroundUrl}?imageView=1&thumbnail=40x0)` }"></div>
      </li>
      <li @click="renicknameWin = true;tempNickname = nickname">
        <div>昵称</div>
        <div class="two">{{nickname}}</div>
      </li>
      <li @click="$mask();genderWin = true">
        <div>性别</div>
        <div class="two">{{gender === 0 ? '保密' : gender === 1 ? '男' : gender === 2 ? '女' : ''}}</div>
      </li>
      <li @click="qrWin = true">
        <div>二维码</div>
        <div class="two qr-icon">&#xe600;</div>
      </li>
      <li class="line"></li>
      <li class="birthday" @click="calendarWin = true">
        <div>生日</div>
        <div class="two">{{`${birthdayObject.cYear}-${birthdayObject.cMonth}-${birthdayObject.cDate}`}}</div>
      </li>
      <li @click="areaWin = true">
        <div>地区</div>
        <div class="two">{{areaObj.provName + ' ' + areaObj.cityName}}</div>
      </li>
      <li class="college">
        <div>大学</div>
        <div class="two"></div>
      </li>
      <li class="college-next">此三项可以在“设置”页中设为隐私</li>
      <li class="line"></li>
      <li @click="resignatureWin = true;tempSignature = signature">
        <div>签名</div>
        <div class="two">{{signature === '' ? '还没有签名' : signature}}</div>
      </li>
      <li class="line"></li>
      <li>账号和绑定设置</li>
      <li>个人主页展示设置</li>
    </ul>
    <!-- 修改用户名 -->
    <div v-if="renicknameWin" class="renickname-win">
      <div class="nav">
        <div>
          <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
          <div>修改昵称</div>
        </div>
        <span @click="renicknameSava()">保存</span>
      </div>
      <div class="nickname">
        <input ref="inputNickname" v-model="tempNickname" type="text" placeholder="请输入昵称" maxlength="15" autofocus="autofocus">
        <span v-if="tempNickname !== ''" @click="tempNickname = '';$refs.inputNickname.focus()">&#xe62b;</span>
      </div>
    </div>
    <!-- 修改性别 -->
    <div v-if="genderWin" class="gender-win">
      <p @click="genderUpdate(0)">保密</p>
      <p @click="genderUpdate(1)">男</p>
      <p @click="genderUpdate(2)">女</p>
    </div>
    <!-- QR Code -->
    <div v-if="qrWin" class="my-qr-win">
      <div class="nav">
        <div>
          <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
          <div>我的二维码</div>
        </div>
      </div>
      <div class="pic">
        <div>
          <div class="avatar" :style="{ backgroundImage: `url(${avatar})` }"></div>
          <span>{{nickname}}</span>
        </div>
        <vue-qr :logoSrc="logo" :logoScale="0.215" :correctLevel="2" :margin="0" :text="link" :size="300" :dotScale="1" class="qr"></vue-qr>
        <p class="description">扫描上面二维码，即可在网易云音乐里关注</p>
      </div>
    </div>
    <!-- 生日选择 -->
    <calendar :cYear.sync="birthdayObject.cYear" :cMonth.sync="birthdayObject.cMonth" :cDate.sync="birthdayObject.cDate" :cShow.sync="calendarWin"></calendar>
    <!-- 地区选择 -->
    <areaWin :provCode.sync="areaObj.provCode" :cityCode.sync="areaObj.cityCode" :provName.sync="areaObj.provName" :cityName.sync="areaObj.cityName" :areaShow.sync="areaWin"></areaWin>
    <!-- 签名 -->
    <div v-if="resignatureWin" class="resignature-win">
      <div class="nav">
        <div>
          <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
          <div>修改签名</div>
        </div>
        <span @click="resignatureSava()">保存</span>
      </div>
      <div class="signature">
        <textarea v-model="tempSignature" cols="" rows="12" maxlength="300" placeholder="一句话介绍" autofocus="autofocus"></textarea>
        <span>{{300 - tempSignature.length}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import VueQr from 'vue-qr'
import areaWin from './plugins/area-select'
import calendar from './plugins/calendar'
import { timestampToTime } from '../utils/tools'
import { areaCodeApi, userSubcountApi } from '../utils/api'
import { mapMutations } from 'vuex'
import { getGLOBAL } from '../utils/store'

export default {
  name: 'my-detail',
  components: { areaWin, calendar, VueQr },
  data() {
    return {
      // 方法
      getGLOBAL,
      // 数据
      // 省份
      areaObj: {
        provName: 'NULL',
        cityName: 'NULL',
        provCode: getGLOBAL('userInfo').province,
        cityCode: getGLOBAL('userInfo').city
      },
      areaWin: false,
      // 生日
      birthdayObject: {
        cYear: 1970,
        cMonth: 1,
        cDate: 1
      },
      calendarWin: false,
      // 其他
      firstOpen: true,
      birthday: getGLOBAL('userInfo').birthday,
      nickname: getGLOBAL('userInfo').nickname,
      tempNickname: getGLOBAL('userInfo').nickname,
      gender: getGLOBAL('userInfo').gender,
      avatar: getGLOBAL('userInfo').avatarUrl,
      signature: getGLOBAL('userInfo').signature,
      tempSignature: getGLOBAL('userInfo').signature,
      renicknameWin: false,
      genderWin: false,
      qrWin: false,
      resignatureWin: false,
      link: `https://m.music.163.com/m/applink/?scheme=orpheus://user/${getGLOBAL('userInfo').uid}&go=1&res=1`,
      logo: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDIzLjAuNCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IuODrOOCpOODpOODvF8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiCgkgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjYyIDI2MiIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMjYyIDI2MjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPgoJLnN0MHtmaWxsOiNGRkZGRkY7fQoJLnN0MXtmaWxsOm5vbmU7fQoJLnN0MntmaWxsOiNERDAwMUI7fQo8L3N0eWxlPgo8cmVjdCB4PSIyMyIgeT0iMjMiIGNsYXNzPSJzdDAiIHdpZHRoPSIyMTYiIGhlaWdodD0iMjE2Ii8+CjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0wLDB2MjYyaDI2MlYwSDB6IE0yMzksMjA4Ljk5YzAsMTYuNTctMTMuNDQsMzAuMDEtMzAuMDEsMzAuMDFINTMuMDFDMzYuNDQsMjM5LDIzLDIyNS41NiwyMywyMDguOTlWNTMuMDEKCUMyMywzNi40NCwzNi40NCwyMyw1My4wMSwyM2gxNTUuOThDMjI1LjU2LDIzLDIzOSwzNi40NCwyMzksNTMuMDFWMjA4Ljk5eiIvPgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjA4Ljk5LDIzSDUzLjAxQzM2LjQ0LDIzLDIzLDM2LjQ0LDIzLDUzLjAxdjE1NS45OEMyMywyMjUuNTYsMzYuNDQsMjM5LDUzLjAxLDIzOWgxNTUuOTgKCWMxNi41NywwLDMwLjAxLTEzLjQ0LDMwLjAxLTMwLjAxVjUzLjAxQzIzOSwzNi40NCwyMjUuNTYsMjMsMjA4Ljk5LDIzeiIvPgo8cGF0aCBkPSJNMjI4Ljk4LDBIMzMuMDJDMTQuNzgsMCwwLDE0Ljc4LDAsMzMuMDJ2MTk1Ljk2QzAsMjQ3LjIyLDE0Ljc4LDI2MiwzMy4wMiwyNjJoMTk1Ljk2YzE4LjI0LDAsMzMuMDItMTQuNzgsMzMuMDItMzMuMDIKCVYzMy4wMkMyNjIsMTQuNzgsMjQ3LjIyLDAsMjI4Ljk4LDB6IE0yMzksMjA4Ljk5YzAsMTYuNTctMTMuNDQsMzAuMDEtMzAuMDEsMzAuMDFINTMuMDFDMzYuNDQsMjM5LDIzLDIyNS41NiwyMywyMDguOTlWNTMuMDEKCUMyMywzNi40NCwzNi40NCwyMyw1My4wMSwyM2gxNTUuOThDMjI1LjU2LDIzLDIzOSwzNi40NCwyMzksNTMuMDFWMjA4Ljk5eiIvPgo8cGF0aCBjbGFzcz0ic3QyIiBkPSJNMTc3LjQ5LDIxM0g4NC41MUM2NC45LDIxMyw0OSwxOTcuMSw0OSwxNzcuNDlWODQuNTFDNDksNjQuOSw2NC45LDQ5LDg0LjUxLDQ5aDkyLjk5CgljMTkuNiwwLDM1LjUsMTUuOSwzNS41LDM1LjUxdjkyLjk5QzIxMywxOTcuMSwxOTcuMSwyMTMsMTc3LjQ5LDIxM3oiLz4KPGc+Cgk8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTI5Ljg3LDg4LjM4YzAuNzEtOS45MiwxMC40NS0xNy45MywyMC4yNS0xNy40M2M1LjY4LDAuMTUsMTEuMjUsMi40MiwxNS42MSw2LjAxCgkJYzIuOTIsMi4yNywzLjk3LDYuODEsMi4wMiwxMC4wMWMtMi4yNSwzLjI0LTcuMjMsMy4wNy0xMC4xMiwwLjgyYy0yLjY4LTIuMDktNi4xMS0zLjk2LTkuNjEtMy4yYy0zLjA2LDAuNzEtNC40OCw0LjE2LTMuOTksNy4wNAoJCWMwLjUsMi44OSwxLjQ1LDUuNjgsMi4yLDguNTFjNS41NCwwLjI0LDExLjA4LDEuNjYsMTUuOTYsNC4zM2M4LjEyLDQuNjcsMTUuMDcsMTEuNjUsMTguOSwyMC4yN2MzLjY2LDguMDEsNC40MywxNy4xMiwyLjk4LDI1Ljc1CgkJYy0yLjA2LDExLjItOC41MSwyMS40MS0xNy4yOCwyOC42Yy05Ljk0LDguMTQtMjIuOTIsMTIuMTEtMzUuNjksMTEuOTljLTExLjk5LDAtMjMuODYtNC4zLTMzLjIyLTExLjc3CgkJYy0xMi41My05Ljg4LTIwLjU5LTI1LjIxLTIxLjQ4LTQxLjE1Yy0wLjc4LTExLjE1LDIuMDctMjIuNDcsNy43OS0zMi4wNWM2LjU3LTExLjA4LDE3LjAxLTE5LjgyLDI5LjExLTI0LjI2CgkJYzIuMDktMC42OSw0LjUtMC42Niw2LjQzLDAuNDRjMy4wMiwxLjU4LDQuMjksNS44OCwyLjQxLDguNzhjLTEuMDIsMS44NC0yLjg4LDMuMDItNC44MiwzLjY5Yy05Ljk0LDMuODMtMTguMywxMS41Mi0yMywyMS4wNwoJCWMtMy44Nyw3LjY3LTUuMjEsMTYuNTItMy45OSwyNWMxLjU1LDExLjE1LDcuNjcsMjEuNTgsMTYuNjMsMjguNGM3LjE0LDUuNDcsMTYuMTUsOC41OSwyNS4xNyw4LjM0CgkJYzEwLjM1LTAuMDMsMjAuOTMtMy42NSwyOC40LTEwLjk3YzUuMzctNS4zMiw5LjM5LTEyLjI5LDEwLjI2LTE5Ljg5YzEuMjYtOC4yLTAuOTQtMTYuOTctNi40NS0yMy4yNgoJCWMtMy44My00LjI3LTguNjItOC4wNC0xNC4zMi05LjM3YzEuMzQsNC4xLDIuNTcsOC4yMywzLjczLDEyLjM4YzEuNjEsNi4xNCwxLjY4LDEzLTEuNDQsMTguNjljLTMuMzMsNi40MS05LjgzLDExLjA4LTE3LDEyLjA4CgkJYy02Ljc4LDEuMTgtMTQuMDMtMS4xNy0xOC45My01Ljk4Yy00LjcyLTQuNDctNy40Mi0xMC45LTcuNjUtMTcuMzdjLTAuNDctNi4xNCwwLjgyLTEyLjQ2LDQuMDMtMTcuNzQKCQljNC4yOS03LjI0LDExLjc0LTEyLjI0LDE5Ljc2LTE0LjQ5QzEzMS41MSw5Ny4yOCwxMjkuNTUsOTIuOTgsMTI5Ljg3LDg4LjM4IE0xMjIuOTUsMTI2LjQzYy0xLjQ3LDUuMjMtMSwxMS43NCwzLjI5LDE1LjU1CgkJYzQuMDEsMy42NSwxMC45OCwyLjE3LDEzLjYyLTIuNDFjMS42Ni0yLjU2LDEuNjktNS43OCwxLjA5LTguNjdjLTEuNDgtNS40Ny0zLjE4LTEwLjg5LTQuOTEtMTYuMjkKCQlDMTMwLjI5LDExNi40MSwxMjQuNjgsMTIwLjM5LDEyMi45NSwxMjYuNDN6Ii8+CjwvZz4KPC9zdmc+Cg=='
    }
  },
  watch: {
    '$store.state.windows.mask'(newer, older) {
      if (newer) return
      this.genderWin = false
    },
    birthdayObject: {
      handler: function() {
        if (this.firstOpen) return
        this.birthdayUpdate()
      },
      deep: true
    },
    areaObj: {
      handler: function() {
        if (this.firstOpen) return
        this.profileUpdate()
      },
      deep: true
    }
  },
  created() {
    this.cityCodeReq()
    setTimeout(() => { this.firstOpen = false }, 1500)
    let birthdaySplit = timestampToTime(this.birthday.toString(), 'YMD', '-').split('-')
    this.birthdayObject.cYear = Number(birthdaySplit[0])
    this.birthdayObject.cMonth = Number(birthdaySplit[1])
    this.birthdayObject.cDate = Number(birthdaySplit[2])
  },
  methods: {
    ...mapMutations([
      'SET_WINDOWS',
      'SET_PAGE_DATA'
    ]),

    // 生日变更
    birthdayUpdate() {
      let date = new Date(`${this.cYear}/${this.cMonth}/${this.cDate}`)
      let unixTimestamp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()))
      this.birthday = ((unixTimestamp.getTime() / 1000) - (8 * 60 * 60)) * 1000   // GMT +8 转毫秒
      this.profileUpdate()
    },

    // 获取地区
    cityCodeReq() {
      if (getGLOBAL('userInfo').province === 0) return
      areaCodeApi({
        prov: getGLOBAL('userInfo').province,
        city: getGLOBAL('userInfo').city
      }).then(succ => {
        console.log('获取地区名（success）：', succ)
        this.areaObj.provName = succ.prov
        this.areaObj.cityName = succ.city
      }).catch(err => {
        console.warn('获取地区名（error）：', err)
      })
    },

    // 昵称修改
    renicknameSava() {
      if (typeof this.tempNickname !== 'string') this.tempNickname += ''
      if (this.tempNickname.replace(/[^\x00-\xff]/g, '01').length < 2) {
        this.$toast('昵称不能少于2个汉字，或4个英文字符')
        return
      }
      this.profileUpdate(() => {
        this.renicknameWin = false
        this.nickname = this.tempNickname
      })
    },

    // 性别修改
    genderUpdate(res) {
      this.$rmask()
      this.gender = res
      this.genderWin = false
      this.profileUpdate()
    },

    // 签名修改
    resignatureSava() {
      this.profileUpdate(() => {
        this.resignatureWin = false
        this.signature = this.tempSignature
      })
    },

    // 提交数据
    profileUpdate(callback) {
      this.$loading()
      userSubcountApi({
        city: this.areaObj.cityCode,
        gender: this.gender,
        province: this.areaObj.provCode,
        birthday: this.birthday,
        nickname: this.tempNickname,
        signature: this.tempSignature
      }).then(succ => {
        console.log('用户信息变更（success）：' + succ)
        this.$rloading()
        if (succ.code !== 200) {
          this.$toast(succ.message)
          return
        }
        if (callback !== undefined) callback()
        this.$toast('信息变更成功')
        if (this.gender !== getGLOBAL('userInfo').gender) this.SET_PAGE_DATA(['userInfo', 'gender', this.gender])
        if (this.cityCode !== getGLOBAL('userInfo').city) this.SET_PAGE_DATA(['userInfo', 'city', this.cityCode])
        if (this.nickname !== getGLOBAL('userInfo').nickname) this.SET_PAGE_DATA(['userInfo', 'nickname', this.nickname])
        if (this.birthday !== getGLOBAL('userInfo').birthday) this.SET_PAGE_DATA(['userInfo', 'birthday', this.birthday])
        if (this.provCode !== getGLOBAL('userInfo').province) this.SET_PAGE_DATA(['userInfo', 'province', this.provCode])
        if (this.signature !== getGLOBAL('userInfo').signature) this.SET_PAGE_DATA(['userInfo', 'signature', this.signature])
      }).catch(err => {
        console.warn('用户信息变更（error）：' + err)
        this.$rloading()
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.renicknameWin || this.qrWin || this.resignatureWin || this.areaWin || this.calendarWin) {
      this.qrWin = false
      this.areaWin = false
      this.calendarWin = false
      this.renicknameWin = false
      this.resignatureWin = false
      return next(false)
    }
    next()
  }
}
</script>

<style lang="scss">
.my-detail-page {
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
  >.main {
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    .line {
      height: 15px;
      margin-left: unset;
      background: #f5f5f5;
    }
    >li {
      height: 90px;
      margin-left: 28px;
      padding-right: 28px;
      font-size: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1.5px solid #f5f5f5;
      .avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: no-repeat center center / cover;
      }
      .bg {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        background: no-repeat center center / cover;
      }
      .date-picker {
        width: 100%;
        height: 100%;
        position: unset;
        .input-wrapper {
          width: 100%;
          height: 100%;
          border: unset;
          padding: unset;
          height: unset;
          line-height: 90px;
          text-align: right;
          img {
            display: none;
          }
          .input {
            color: #909090;
          }
        }
        .date-panel {
          top: 20%;
          left: 50% !important;
          margin-left: -160PX;
        }
      }
      div:first-child {
        flex-shrink: 0;
      }
      .two {
        color: #909090;
        max-width: 15em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 25px;
      }
      .qr-icon {
        font-size: 36px;
      }
    }
    >li:nth-child(2), >li:nth-child(3) {
      height: 110px;
    }
    >li:nth-child(6), >li:nth-child(11), >li:nth-child(13), >li:last-child, .college {
      border: none;
    }
    .college-next {
      color: #909090;
      border: none;
      font-size: 20px;
    }
  }
  .renickname-win {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background: #fff;
    .nickname {
      height: 80px;
      margin: 110px 28px 0;
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
  }
  .gender-win {
    width: 655px;
    background: #fff;
    position: absolute;
    top: 35%;
    left: 50%;
    z-index: 11;
    margin-left: -327.5px;
    border-radius: 18px;
    padding: 0 35px;
    p {
      line-height: 85px;
    }
  }
  .my-qr-win {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background: #000;
    .nav {
      color: #fff;
    }
    .pic {
      width: 550px;
      border-radius: 5px;
      background: #fff;
      position: absolute;
      top: 195px;
      left: 50%;
      margin-left: -275px;
      padding: 60px;
      div {
        font-size: 30px;
        display: flex;
        align-items: center;
        .avatar {
          width: 95px;
          height: 95px;
          border-radius: 50%;
          margin-right: 20px;
          background: no-repeat center center / cover;
        }
      }
      .qr {
        margin: 50px 0 40px;
      }
      .description {
        color: #cecece;
        text-align: center;
      }
    }
  }
  .resignature-win {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background: #fff;
    .signature {
      padding: 120px 20px 0;
      position: relative;
      textarea {
        width: 100%;
        resize: none;
        font-size: 27px;
        text-align: justify;
        line-height: 1.3em;
      }
      span {
        color: #ccc;
        position: absolute;
        right: 20px;
        bottom: 0;
      }
    }
  }
}
</style>
