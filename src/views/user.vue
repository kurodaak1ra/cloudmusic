<template>
  <div class="user-page web-page" :style="{ backgroundImage: playlist.background.validType === 4 ? `url(${playlist.userDetail.fullBackground})` : '' }">
    <div class="nav">
      <div v-if="slideToTop" class="bg" :style="{ backgroundImage: `url(${playlist.background.validType === 4 ? playlist.userDetail.fullBackground : playlist.userDetail.singleBackground })`, backgroundPositionY: playlist.background.validType === 4 ? 0 : scrollLength - (scrollLength / 3) + 'px', filter: playlist.background.validType === 4 ? '' : `brightness(${filter})` }"></div>
      <div ref="nav" class="main-nav">
        <div class="left">
          <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
          <div v-if="slideToTop">
            <p class="nickname">{{playlist.userDetail.nickname}}</p>
            <p v-if="getGLOBAL('user').id !== getGLOBAL('userInfo').uid" class="fans">{{formatCount(playlist.userDetail.followeds)}}粉丝</p>
          </div>
        </div>
        <div class="right">
          <span v-if="slideToTop && !playlist.userDetail.followed && getGLOBAL('user').id !== getGLOBAL('userInfo').uid" class="subscribe" @click="follow()">&#xe666; 关注</span>
          <span v-if="getGLOBAL('user').id !== getGLOBAL('userInfo').uid">&#xe61f;</span>
          <span v-else v-clipboard:copy="link" v-clipboard:success="shareCopySucc" v-clipboard:error="shareCopyErr">&#xe674;</span>
        </div>
      </div>
      <div v-if="slideToTop" class="mid-title" :class="{ 'main-title-white-style': playlist.background.validType === 4 }">
        <div :class="{ 'active': navIndex === 0 }" @click="swiper.slideTo(0, 300)">
          <span>主页</span>
          <i></i>
        </div>
        <div :class="{ 'active': navIndex === 1 }" @click="swiper.slideTo(1, 300)">
          <span>动态<span v-if="playlist.userDetail.eventCount !== 0">{{playlist.userDetail.eventCount}}</span></span>
          <i></i>
        </div>
      </div>
    </div>
    <scroll ref="scroll" :up="getScrollUp()">
      <div class="top">
        <div v-if="playlist.background.validType !== 4" class="bg" :style="{ backgroundImage: `url(${playlist.userDetail.singleBackground})`, backgroundPositionY: -scrollLength / 3 + 'px', filter: `brightness(${filter})` }"></div>
        <div ref="usreInfo" class="user-info" :style="{ opacity: opacity }">
          <div class="user-info-top">
            <img v-if="playlist.pendant !== null && playlist.pendant.imageAndroidUrl !== null" class="pendant" :src="playlist.pendant.imageAndroidUrl" alt="">
            <img v-if="playlist.pendant !== null && playlist.pendant.imageUrl !== null" class="pendant" :src="playlist.pendant.imageUrl" alt="">
            <img v-if="playlist.userDetail.userType === 200" class="star" src="../assets/img/user/star.svg" alt="">
            <div class="avatar" :style="{ backgroundImage: `url(${playlist.userDetail.avatarUrl})` }"></div>
          </div>
          <div class="user-info-btm">
            <div class="user-info-btm-left">
              <p class="nickname">{{playlist.userDetail.nickname === null ? '&nbsp;' : playlist.userDetail.nickname}}</p>
              <p class="sub-fans">
                <span>关注 {{formatCount(playlist.userDetail.newFollows)}}</span>
                <span>粉丝 {{formatCount(playlist.userDetail.followeds)}}</span>
              </p>
              <ul class="vip-gender-level">
                <li class="vip-logo">
                  <img v-if="playlist.vipInfo.hasOwnProperty('associator') && playlist.vipInfo.associator.isSign" src="../assets/img/user/vip-type/2.webp" alt="">
                  <img v-if="playlist.vipInfo.hasOwnProperty('associator') && !playlist.vipInfo.associator.isSign && playlist.vipInfo.redVipAnnualCount !== -1" src="../assets/img/user/vip-type/4.webp" alt="">
                  <img v-if="playlist.vipInfo.hasOwnProperty('musicPackage') && playlist.vipInfo.musicPackage.isSign" src="../assets/img/user/vip-type/5.webp" alt="">
                </li>
                <li v-if="playlist.userDetail.birthdayUnix > 0" :style="{ backgroundColor: playlist.userDetail.gender === 1 ? 'rgba(61, 168, 221, 0.5)' : playlist.userDetail.gender === 2 ? 'rgba(255, 128, 179, 0.5)' : 'rgba(255, 255, 255, 0.5)' }">
                  <span v-if="playlist.userDetail.gender === 1" style="color: #3da8dd">&#xe665;&nbsp;</span>
                  <span v-if="playlist.userDetail.gender === 2" style="color: #ff80b3">&#xe664;&nbsp;</span>
                  <span>{{playlist.userDetail.birthday.year.toString().substring(2, 3)}}0后</span>
                </li>
                <li class="level">Lv.{{playlist.userDetail.level}}</li>
              </ul>
            </div>
            <div class="user-info-btm-right">
              <div v-if="getGLOBAL('user').id === getGLOBAL('userInfo').uid" class="me">
                <span @click="$router.push({ path: '/my-details' })">编辑</span>
                <span>更换背景</span>
              </div>
              <div v-else class="not-me">
                <p class="followd-days">{{playlist.userDetail.followTime}}</p>
                <span v-if="playlist.userDetail.followed" class="follow-yes" @click="follow()">&#xe64b;</span>
                <span v-else class="follow-no" @click="follow()">&#xe666; 关注</span>
                <span class="msg">&#xe643; 发私信</span>
              </div>
            </div>
          </div>
        </div>
        <div ref="mainTitle" class="mid-title" :class="{ 'main-title-white-style': playlist.background.validType === 4 }">
          <div :class="{ 'active': navIndex === 0 }" @click="swiper.slideTo(0, 300)">
            <span>主页</span>
            <i></i>
          </div>
          <div :class="{ 'active': navIndex === 1 }" @click="swiper.slideTo(1, 300)">
            <span>动态<span v-if="playlist.userDetail.eventCount !== 0">{{playlist.userDetail.eventCount}}</span></span>
            <i></i>
          </div>
        </div>
      </div>
      <swiper ref="mySwiper" :options="swiperOption()">
        <!-- 主页 -->
        <swiper-slide class="homepage" :style="{ minHeight: `${minHeight}px` }" :class="{ 'white-style': playlist.background.validType === 4 }">
          <!-- 用户信息 -->
          <div class="user-info">
            <p class="info-title">基本信息</p>
            <div v-for="(i, index) in playlist.userDetail.allAuthTypes" :key="index" class="auth-types">
              <img v-if="i.type === 300" src="../assets/img/user/png/committee.png" alt="">
              <img v-else src="../assets/img/user/star.svg" alt="">
              <p>{{i.desc}}</p>
            </div>
            <p class="village-age">村龄：{{Math.floor(playlist.userDetail.createDays / 365)}}年（{{timestampToTime(playlist.userDetail.createTime, 'YM')}}注册）</p>
            <p v-if="playlist.userDetail.birthdayUnix > 0" class="age">年龄：{{ageExchange(playlist.userDetail.birthday.year) + ' ' + constellation(playlist.userDetail.birthday.month + '.' + playlist.userDetail.birthday.day)}}</p>
            <p v-if="playlist.userDetail.province !== 0" class="area">地区：{{(prov === '直辖市' ? '' : prov + ' ') + city}}</p>
            <p class="more" @click="$router.push({ path: '/user-info' })">更多信息 &#xe624;</p>
          </div>
          <!-- memlog -->
          <div v-if="playlist.memlog.count !== 0" class="memlog">
            <div class="bar">
              <span class="bar-title">Mlog</span>
              <span class="bar-total">({{playlist.memlog.count}})</span>
            </div>
            <ul>
              <li v-for="(i, index) in playlist.memlog.data" :key="index">
                <div class="cover" :style="{ backgroundImage: `url(${i.mlogBaseData.coverUrl}?imageView=1&thumbnail=338x0)` }"></div>
                <div class="info">
                  <p class="one-line-ellipsis">{{i.mlogBaseData.text}}</p>
                  <p class="one-line-ellipsis">{{i.mlogExtVO.likedCount}}赞</p>
                </div>
              </li>
            </ul>
            <p v-if="playlist.memlog.more" class="more">更多Mlog &#xe624;</p>
          </div>
          <!-- favorite -->
          <ul class="favorite content">
            <li>
              <div class="cover ranking"></div>
              <div>
                <p>{{playlist.userDetail.nickname}}的听歌排行</p>
                <p>累计听歌{{playlist.userDetail.listenSongs}}首</p>
              </div>
            </li>
            <li @click="goPlaylist(playlist.favorite.id, playlist.favorite.name)">
              <div class="cover like"></div>
              <div>
                <p>{{playlist.favorite.name}}</p>
                <p>{{playlist.favorite.trackCount}}首，播放{{formatCount(playlist.favorite.playCount)}}次</p>
              </div>
            </li>
          </ul>
          <!-- 电台 -->
          <ul v-if="playlist.djRadio.count !== 0" class="dj-radio content">
            <div class="bar">
              <span class="bar-title">电台</span>
              <span class="bar-total">({{playlist.djRadio.count}}个，被{{formatCount(playlist.djRadio.subCount)}}人订阅)</span>
            </div>
            <li v-for="(i, index) in playlist.djRadio.data" :key="index" @click="goPlaylist(i.id, i.name)">
              <div class="cover" :style="{ backgroundImage: `url(${i.picUrl}?imageView=1&thumbnail=90x0)` }"></div>
              <div>
                <p class="dj-name">
                  <span>{{i.category}}</span>
                  <span>{{i.name}}</span>
                </p>
                <p class="dj-info">共{{i.programCount}}期，{{formatCount(i.subCount)}}人订阅</p>
              </div>
            </li>
            <p v-if="playlist.djRadio.more" class="more">更多电台 &#xe624;</p>
          </ul>
          <!-- 创建的歌单 -->
          <ul v-if="playlist.create.count !== 0" class="create content">
            <div class="bar">
              <span class="bar-title">创建的歌单</span>
              <span class="bar-total">({{playlist.create.count}}个，被收藏{{formatCount(playlist.create.subCount)}}次)</span>
            </div>
            <li v-for="(i, index) in playlist.create.data" :key="index" @click="goPlaylist(i.id, i.name)">
              <div class="cover" :style="{ backgroundImage: `url(${i.coverImgUrl}?imageView=1&thumbnail=90x0)` }"></div>
              <div>
                <p>{{i.name}}</p>
                <p>{{i.trackCount}}首，播放{{formatCount(i.playCount)}}次</p>
              </div>
            </li>
            <p v-if="playlist.create.more" class="more">更多歌单 &#xe624;</p>
          </ul>
          <!-- 收藏的歌单 -->
          <ul v-if="playlist.collect.count !== 0" class="collect content">
            <div class="bar">
              <span class="bar-title">收藏的歌单</span>
              <span class="bar-total">({{playlist.collect.count}})</span>
            </div>
            <li v-for="(i, index) in playlist.collect.data" :key="index" @click="goPlaylist(i.id, i.name)">
              <div class="cover" :style="{ backgroundImage: `url(${i.coverImgUrl}?imageView=1&thumbnail=90x0)` }"></div>
              <div>
                <p>{{i.name}}</p>
                <p>{{i.trackCount}}首，播放{{formatCount(i.playCount)}}次</p>
              </div>
            </li>
            <p v-if="playlist.collect.more" class="more">更多歌单 &#xe624;</p>
          </ul>
        </swiper-slide>
        <!-- 动态 -->
        <swiper-slide class="dynmic" :style="{ minHeight: `${minHeight}px` }">
          <p v-if="playlist.userDetail.eventCount === 0" class="no-dynmic">暂时还没有动态哦</p>
          <p v-else class="no-dynmic">还没写</p>
        </swiper-slide>
      </swiper>
    </scroll>
  </div>
</template>

<script>
import scroll from './plugins/scroll'
import { mapMutations } from 'vuex'
import { getGLOBAL } from '../utils/store'
import { goPlaylist, goLogin } from '../utils/function'
import { imgToBlob, formatCount, constellation, timestampToTime, ageExchange } from '../utils/tools'
import { batchApi, followApi, areaCodeApi } from '../utils/api'

export default {
  name: 'user',
  components: { scroll },
  data() {
    return {
      // 方法
      formatCount,
      constellation,
      timestampToTime,
      ageExchange,
      getGLOBAL,
      goPlaylist,
      // 数据
      playlist: {
        memlog: { data: [], count: 0, more: false },
        pendant: {},
        vipInfo: {},
        background: {},
        favorite: { id: null, name: '', trackCount: 0, playCount: 0 },
        djRadio: { data: [], count: 0, subCount: 0, more: false },
        create: { data: [], count: 0, subCount: 0, more: false },
        collect: { data: [], count: 0, subCount: 0, more: false },
        userDetail: {
          level: 0,
          createDays: 0,
          createTime: 0,
          uid: null,
          nickname: '',
          followTime: '已关注0天',
          follows: 0,
          followed: false,
          followeds: 0,
          newFollows: 0,
          listenSongs: 0,
          gender: 0,
          playlistCount: 0,
          eventCount: 0,
          userType: 0,
          birthdayUnix: -1,
          allAuthTypes: [],
          birthday: {
            year: '1970',
            month: '01',
            day: '01'
          },
          avatarUrl: getGLOBAL('1px')['eeeeee'],
          singleBackground: getGLOBAL('1px')['cccccc'],
          fullBackground: getGLOBAL('1px')['cccccc']
        }
      },
      link: `https://m.music.163.com/m/applink/?scheme=orpheus://user/${getGLOBAL('user').id}&go=1&res=1`,
      prov: '',
      city: '',
      navIndex: 0,
      // 滑动数据
      opacity: 1,
      filter: 0.9,
      minHeight: 0,
      scrollLength: 0,
      slideToTop: false
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  mounted() {
    // 设置最小高度，保证每一栏都可以向上滚动
    this.minHeight = document.body.offsetHeight - this.$refs.nav.offsetHeight - this.$refs.mainTitle.offsetHeight
  },
  methods: {
    ...mapMutations([
      'SET_GLOBAL',
      'SET_PAGE_DATA'
    ]),

    // scroll
    getScrollUp() {
      return {
        auto: true,
        callback: () => { this.init() },
        onScroll: (y, isUp) => {
          // 是否拉到顶端及中途操作
          let topHeight = this.$refs.usreInfo.offsetHeight
          if (y >= topHeight) {
            this.slideToTop = true
            this.scrollLength = -topHeight
            this.opacity = 0
          } else {
            this.slideToTop = false
            // 背景缓慢滑动
            this.scrollLength = -y
            // 明暗度
            let dark = 1 - y / (topHeight - 50)
            // 透明度
            this.opacity = dark
            // 背景明暗度
            if (dark <= 0.3) {
              this.filter = 0.3
            } else if (dark >= 0.9) {
              this.filter = 0.9
            } else {
              this.filter = dark
            }
          }
        }
      }
    },

    // swiper
    swiperOption() {
      let _this = this
      return {
        autoHeight: true,
        on: {
          slideChangeTransitionEnd: function() {
            _this.navIndex = this.activeIndex
          }
        }
      }
    },

    // share
    shareCopySucc() {
      this.$toast('复制成功')
    },
    shareCopyErr() {
      this.$toast('复制失败')
    },

    // 初始化
    init() {
      let data = ['mymlog', 'user-detail', 'pendant-user', 'vip-info', 'full-background', 'playlist-favorite', 'dj-radio', 'playlist-create', 'playlist-collect']
      batchApi({
        batch: data.toString(),
        uid: getGLOBAL('user').id
      }).then(succ => {
        console.log('获取用户信息（success）：', succ)
        this.userDetailinfo(succ[`/api/v1/user/detail/${getGLOBAL('user').id}`])
        // 头像挂件
        this.playlist.pendant = succ['/api/pendant/user/get'].data.pendantData
        // vip 信息
        this.playlist.vipInfo = succ['/api/music-vip-membership/client/vip/info'].data
        this.userPlaylistInfo(
          succ['/api/mlog/mymlog/get'].data,
          succ['/api/user/page/pretend/info'].data,
          succ['/api/user/playlist/favorite'].data,
          succ['/api/djradio/get/byuser/v1'],
          succ['/api/user/playlist/create'].data,
          succ['/api/user/playlist/collect'].data
        )
        this.$refs.scroll.upEndSucc({ more: false })
      }).catch(err => {
        console.warn('获取用户信息（error）：', err)
        this.$refs.scroll.upEndErr()
      })
    },

    // 用户详细信息
    userDetailinfo(succ) {
      let date = new Date(succ.profile.birthday)
      this.playlist.userDetail = {
        level: succ.level,
        createDays: succ.createDays,
        createTime: succ.createTime,
        uid: succ.profile.userId,
        nickname: succ.profile.nickname,
        followTime: succ.profile.followTime,
        follows: succ.profile.follows,
        followed: succ.profile.followed,
        followeds: succ.profile.followeds,
        newFollows: succ.profile.newFollows,
        listenSongs: succ.listenSongs,
        gender: succ.profile.gender,
        province: succ.profile.province,
        playlistCount: succ.profile.playlistCount,
        eventCount: succ.profile.eventCount,
        birthdayUnix: succ.profile.birthday,
        userType: succ.profile.userType,
        allAuthTypes: succ.profile.allAuthTypes,
        birthday: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        },
        avatarUrl: getGLOBAL('1px')['eeeeee'],
        singleBackground: getGLOBAL('1px')['cccccc'],
        fullBackground: getGLOBAL('1px')['cccccc']
      }
      this.cityCode(succ.profile.province, succ.profile.city)
      imgToBlob(succ.profile.avatarUrl + '?imageView=1&thumbnail=140x0', res => { this.playlist.userDetail.avatarUrl = res })
    },

    // 用户歌单信息
    userPlaylistInfo(memlog, background, favorite, djRadio, create, collect) {
      // memlog
      this.playlist.memlog = {
        data: memlog.mlogAggregationVOS,
        count: memlog.totalCount,
        more: memlog.more
      }
      // 背景
      this.playlist.background = background
      if (background.vip && background.validType === 4) {
        imgToBlob(background.backgroundValue.fullPicValue, res => { this.playlist.userDetail.fullBackground = res }, 0, -0.12)
      } else if (background.vip && background.validType === 3) {
        imgToBlob(background.backgroundValue.videoPic + '?imageView=1&thumbnail=400x0', res => { this.playlist.userDetail.singleBackground = res })
      } else {
        imgToBlob(background.backgroundValue.singlePicValue + '?imageView=1&thumbnail=400x0', res => { this.playlist.userDetail.singleBackground = res })
      }
      // 喜欢的
      this.playlist.favorite = {
        id: favorite.id,
        name: favorite.name,
        trackCount: favorite.trackCount,
        playCount: favorite.playCount
      }
      // 电台
      this.playlist.djRadio = {
        data: djRadio.djRadios,
        more: djRadio.hasMore,
        count: djRadio.count,
        subCount: djRadio.subCount
      }
      // 创建的歌单
      this.playlist.create = {
        data: create.playlist,
        more: create.more,
        count: create.count,
        subCount: create.subCount
      }
      // 收藏的歌单
      this.playlist.collect = {
        data: collect.playlist,
        more: collect.more,
        count: collect.count,
        subCount: collect.subCount
      }
    },

    // 关注
    follow() {
      if (!getGLOBAL('isLogin')) goLogin('user', getGLOBAL('user').id)
      followApi({
        id: this.playlist.userDetail.uid,
        t: this.followed ? 0 : 1
      }).then(succ => {
        console.log('关注（success）：', succ)
      }).catch(err => {
        console.warn('关注（error）：', err)
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
.user-page {
  background: no-repeat center center / cover;
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      background: no-repeat top center / cover;
      transition: background-image 0.4s;
    }
    .main-nav {
      color: #fff;
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px;
      font-size: 40px;
      .left {
        display: flex;
        align-items: center;
        .back-icon {
          font-size: 35px;
          margin-right: 30px;
        }
        div {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          .nickname {
            font-size: 30px;
          }
          .fans {
            color: #fff;
            font-size: 15px;
          }
        }
      }
      .right {
        display: flex;
        align-items: center;
        .subscribe {
          width: 100px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-radius: 50PX;
          font-size: 20px;
          margin-right: 25px;
          background: #ff3a3a;
        }
      }
    }
  }
  .top {
    padding-top: 90px;
    position: relative;
    .bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      background: no-repeat top center / cover;
      transition: background-image 0.4s;
    }
    .user-info {
      color: #fff;
      padding: 70px 35px 35px;
      .user-info-top {
        width: 140px;
        position: relative;
        .pendant {
          width: 200px;
          background: no-repeat top center / 150% auto;
          position: absolute;
          top: -30px;
          left: -30px;
        }
        .star {
          width: 35px;
          position: absolute;
          right: 0;
          bottom: 0;
        }
        .avatar {
          width: 100%;
          height: 140px;
          border-radius: 50%;
          background: no-repeat center center / cover;
          transition: background-image 0.4s;
        }
      }
      .user-info-btm {
        margin-top: 35px;
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        .user-info-btm-left {
          .nickname {
            font-size: 30px;
            font-weight: bold;
          }
          .sub-fans {
            color: #f2f2f2;
            font-size: 22px;
            margin: 15px 0;
            line-height: 1em;
            span {
              text-shadow: 0PX 1PX 1PX rgba(0, 0, 0, 0.3);
            }
            span:first-child {
              border-right: 1px solid #f2f2f2;
              margin-right: 15px;
              padding-right: 15px;
            }
          }
          .vip-gender-level {
            overflow: hidden;
            li {
              height: 30px;
              float: left;
              font-size: 18px;
              margin-right: 10px;
              padding: 0 1em;
              line-height: 30px;
              border-radius: 50PX;
              background: rgba(255, 255, 255, 0.4);
            }
            .level {
              font-weight: bold;
              font-style: italic;
            }
            .vip-logo {
              padding: 0;
              background: transparent;
              img {
                width: unset;
                height: 100%;
              }
            }
          }
        }
        .user-info-btm-right {
          span {
            display: inline-block;
            padding: 0 0.75em;
            border-radius: 50PX;
            line-height: 50px;
            text-align: center;
            margin-left: 6px;
            font-size: 20px;
            background: rgba(255, 255, 255, 0.4);
          }
          .not-me {
            .followd-days {
              font-size: 18px;
              text-align: right;
              line-height: 2.5em;
              text-shadow: 0PX 1PX 1PX rgba(0, 0, 0, 0.3);
            }
            .follow-yes {
              width: 50px;
              padding: 0;
              border-radius: 50%;
            }
            .follow-no {
              background: #f95546;
            }
          }
        }
      }
    }
  }
  .mid-title {
    height: 75px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 0 160px;
    background: #fff;
    border-bottom: 1.5px solid #f5f5f5;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
    .active {
      color: #dd4137;
      font-weight: bold;
      i {
        background: #dd4137;
      }
    }
    div {
      span {
        span {
          color: #949494;
          font-size: 15px;
        }
      }
      i {
        display: block;
        width: 2em;
        height: 4px;
        border-radius: 4px;
        margin-top: 15px;
      }
    }
  }
  .main-title-white-style {
    background: rgba(255, 255, 255, 0.25);
    border-bottom: none;
    .active {
      color: #fff;
      font-weight: bold;
      i {
        background: #c8a8a8;
      }
    }
    span {
      color: #fff;
    }
  }
  .swiper-container {
    background: rgba(255, 255, 255, 0.25);
  }
  // 主页
  .homepage {
    padding: 20px 28px 35px;
    .bar {
      .bar-title {
        font-size: 30px;
        font-weight: bold;
        line-height: 2.25em;
      }
      .bar-total {
        color: #808080;
        font-size: 20px;
        margin-left: 15px;
      }
    }
    .more {
      color: #666;
      margin-top: 30px;
      text-align: center;
      font-size: 22px;
    }
    .user-info {
      margin-bottom: 40px;
      .info-title {
        font-size: 30px;
        font-weight: bold;
        line-height: 2em;
        padding-bottom: 5px;
      }
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
      .village-age, .age, .area {
        color: #555;
        font-size: 22px;
        line-height: 2em;
      }
    }
    .memlog {
      margin-bottom: 40px;
      ul {
        display: flex;
        justify-content: space-between;
        li {
          width: 338px;
          overflow: hidden;
          position: relative;
          .cover {
            width: 100%;
            height: 435px;
            border-radius: 12px;
            background: no-repeat center center / cover;
          }
          .info {
            color: #fff;
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            padding: 0 15px;
            p:first-child {
              font-size: 22px;
              line-height: 1em;
            }
            p:last-child {
              font-size: 18px;
              line-height: 2.5em;
            }
          }
        }
      }
    }
    .favorite {
      .ranking {
        background-image: url('../assets/img/user/png/ranking.png') !important;
      }
      .like {
        background-image: url('../assets/img/user/heart.svg') !important;
      }
    }
    .content {
      margin-bottom: 40px;
      li {
        display: flex;
        align-items: center;
        padding: 8px 0;
        .cover {
          width: 90px;
          height: 90px;
          border-radius: 8px;
          flex-shrink: 0;
          background: no-repeat center center / cover;
        }
        div:last-child {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          margin-left: 18px;
          p:last-child {
            color: #808080;
            font-size: 20px;
            margin-top: 5px;
          }
        }
      }
    }
    .dj-radio {
      li {
        div {
          .dj-name {
            span:first-child {
              display: inline-block;
              border-radius: 4px;
              font-size: 20px;
              margin-right: 6px;
              padding: 3px;
              line-height: 1em;
              border: 1.5px solid rgba(255, 255, 255, 0.7);
            }
          }
        }
      }
    }
    ul:last-child {
      margin: 0;
    }
  }
  .white-style {
    .bar {
      .bar-title {
        color: #fff !important;
      }
      .bar-total {
        color: rgba(255, 255, 255, 0.7) !important;
      }
    }
    .more {
      color: rgba(255, 255, 255, 0.9) !important;
    }
    .user-info {
      .info-title {
        color: #fff !important;
      }
      .auth-types {
        p {
          color: rgba(255, 255, 255, 0.7) !important;
        }
      }
      .village-age, .age, .area {
        color: rgba(255, 255, 255, 0.7) !important;
      }
    }
    .memlog, .content {
      color: #fff;
      li {
        div:last-child {
          p:last-child {
            color: rgba(255, 255, 255, 0.7) !important;
          }
        }
      }
    }
  }
  // 动态
  .dynmic {
    .no-dynmic {
      color: #808080;
      text-align: center;
      line-height: 12em;
    }
  }
}
</style>
