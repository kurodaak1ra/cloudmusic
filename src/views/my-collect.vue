<template>
  <div class="collect-page web-page">
    <div class="nav">
      <div class="left">
        <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
        <span>我的收藏</span>
      </div>
      <div class="right">&#xe677;</div>
    </div>
    <ul class="sec-nav">
      <li :class="{ 'active': target === 0 }" @click="swiper.slideTo(0, 300)">
        <span>专辑&nbsp;</span>
        <span>{{list.album.total === 0 ? '' : list.album.total}}</span>
        <i></i>
      </li>
      <li :class="{ 'active': target === 1 }" @click="swiper.slideTo(1, 300)">
        <span>歌手&nbsp;</span>
        <span>{{list.artist.total === 0 ? '' : list.artist.total}}</span>
        <i></i>
      </li>
      <li :class="{ 'active': target === 2 }" @click="swiper.slideTo(2, 300)">
        <span>视频&nbsp;</span>
        <span>{{list.mv.total === 0 ? '' : list.mv.total}}</span>
        <i></i>
      </li>
      <li :class="{ 'active': target === 3 }">
        <span>专栏&nbsp;</span>
        <span>{{list.topic.total === 0 ? '' : list.topic.total}}</span>
        <i></i>
      </li>
      <li :class="{ 'active': target === 4 }">
        <span>Mlog&nbsp;</span>
        <span></span>
        <i></i>
      </li>
    </ul>
    <swiper ref="mySwiper" class="list" :options="swiperOption()">
      <!-- 专辑 -->
      <swiper-slide>
        <scroll ref="firScroll" :up="getScrollUp(0, true)">
          <ul class="albums">
            <li v-if="list.album.data.length !== 0" @click="$router.push({ path: '/digital-album' })">
              <div class="cover">
                <div :style="{ backgroundImage: `url(${list.album.cover})` }">&#xe630;</div>
                <img src="../assets/img/collect/digital-album.svg" alt="">
              </div>
              <div class="info">
                <div>
                  <p class="name">我的数字专辑</p>
                </div>
              </div>
            </li>
            <div v-if="list.album.data.length !== 0" class="line"></div>
            <p v-if="list.album.data.length !== 0">
              <span>收藏的专辑</span>
              <span>({{list.album.total}})</span>
            </p>
            <li v-for="(i, index) in list.album.data" :key="index" @click="goAlbum(i.id, i.name)">
              <div class="cover">
                <div :style="{ backgroundImage: `url(${i.picUrl}?imageView=1&thumbnail=100x0)` }"></div>
                <img src="../assets/img/collect/digital-album.svg" alt="">
              </div>
              <div class="info">
                <div>
                  <p class="name one-line-ellipsis">{{i.name}}</p>
                  <p class="artist">{{i.artists[0].name}} {{i.size}}首</p>
                </div>
                <span @click.stop="winFun(0, i.name, i.artists[0].id, i.artists[0].name)">&#xe61f;</span>
              </div>
            </li>
          </ul>
        </scroll>
      </swiper-slide>
      <!-- 歌手 -->
      <swiper-slide>
        <scroll ref="secScroll" :up="getScrollUp(1, false)">
          <ul class="artists">
            <li v-for="(i, index) in list.artist.data" :key="index" @click="goArtist(i.id)">
              <div class="avatar" :style="{ backgroundImage: `url(${i.picUrl}?imageView=1&thumbnail=100x0)` }"></div>
              <div class="info">
                <div>
                  <p>{{i.name}}</p>
                  <p>
                    <span v-if="i.albumSize !== 0">专辑：{{i.albumSize}}</span>&nbsp;
                    <span v-if="i.mvSize !== 0">MV：{{i.mvSize}}</span>
                  </p>
                </div>
                <span @click.stop="winFun(1, i.name)">&#xe61f;</span>
              </div>
            </li>
          </ul>
        </scroll>
      </swiper-slide>
      <!-- 视频 -->
      <swiper-slide>
        <scroll ref="thirScroll" :up="getScrollUp(2, false)">
          <div class="videos">
            <li v-for="(i, index) in list.mv.data" :key="index">
              <div class="cover">
                <div :style="{ backgroundImage: `url(${i.coverUrl}?imageView=1&thumbnail=230x0)` }"></div>
                <span>&#xe667;{{formatCount(i.playTime)}}</span>
              </div>
              <div class="info">
                <div>
                  <p>
                    <span class="mv-icon">MV</span>
                    <span>{{i.title}}</span>
                  </p>
                  <p>{{durationFormat(i.durationms)}} {{i.creator[0].userName}}</p>
                </div>
                <span @click.stop="winFun(2, i.title, i.creator[0].userId, i.creator[0].userName)">&#xe61f;</span>
              </div>
            </li>
          </div>
        </scroll>
      </swiper-slide>
    </swiper>
    <!-- 弹窗 -->
    <ul class="win" :style="{ transform: win.show ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)' }">
      <li class="title one-line-ellipsis">{{win.title}}</li>
      <li v-if="/0|2/i.test(win.type)">
        <span>&#xe673;</span>
        <span>下载</span>
      </li>
      <li v-if="/0|2/i.test(win.type)">
        <span>&#xe674;</span>
        <span>分享</span>
      </li>
      <li v-if="/0|2/i.test(win.type)" @click="goArtist(win.id)">
        <span>&#xe62e;</span>
        <span>歌手：{{win.name}}</span>
      </li>
      <li>
        <span>&#xe625;</span>
        <span>删除</span>
      </li>
    </ul>
  </div>
</template>

<script>
import scroll from './plugins/scroll'
import { mapMutations } from 'vuex'
import { getGLOBAL } from '../utils/store'
import { imgToBlob } from '../utils/tools'
import { batchApi } from '../utils/api'
import { goArtist, goAlbum } from '../utils/function'

export default {
  name: 'my-collect',
  components: { scroll },
  data() {
    return {
      // 方法
      getGLOBAL,
      goAlbum,
      // 数据
      lineX: 0,
      target: 0,
      win: {
        show: false,
        type: 0,
        title: '',
        id: null,
        name: ''
      },
      list: {
        album: {
          data: [],
          total: 0,
          offset: 0,
          cover: getGLOBAL('1px')['000000']
        },
        artist: {
          data: [],
          total: 0,
          offset: 0
        },
        mv: {
          data: [],
          total: 0,
          offset: 0
        },
        topic: {
          data: [],
          total: 0,
          offset: 0
        }
      }
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  watch: {
    '$store.state.windows.mask'(newer, older) {
      this.win.show = newer
    }
  },
  created() {
    this.subCount()
  },
  methods: {
    ...mapMutations([
      'SET_PAGE_DATA'
    ]),

    // scroll
    getScrollUp(type, auto) {
      return {
        auto: auto,
        callback: () => {
          if (type === 0) {
            this.albumSublist()
          } else if (type === 1) {
            this.artistSublist()
          } else if (type === 2) {
            this.mvSublist()
          }
        }
      }
    },

    // swiper
    swiperOption() {
      let _this = this
      return {
        on: {
          slideChangeTransitionEnd: function() {
            _this.target = this.activeIndex
            if (this.activeIndex === 1 && _this.list.artist.data.length === 0) {
              _this.$refs.secScroll.init()
            } else if (this.activeIndex === 2 && _this.list.mv.data.length === 0) {
              _this.$refs.thirScroll.init()
            }
          }
        }
      }
    },

    // 获取收藏量
    subCount() {
      batchApi({
        batch: 'subcount-all'
      }).then(succ => {
        console.log('我的收藏获取收藏数（success）：', succ)
        this.list.album.total = succ['/api/subcount/all'].albumCount
        this.list.artist.total = succ['/api/subcount/all'].artistCount
        this.list.mv.total = succ['/api/subcount/all'].mvCount
        this.list.topic.total = succ['/api/subcount/all'].topicCount
      }).catch(err => {
        console.warn('我的收藏获取收藏数（error）：', err)
      })
    },

    // 获取收藏的专辑
    albumSublist() {
      batchApi({
        batch: 'album-sublist',
        limit: 1000,
        offset: this.list.album.offset
      }).then(succ => {
        console.log('获取收藏的专辑（success）：', succ)
        this.list.album.offset += 1000
        this.list.album.data = this.list.album.data.concat(succ['/api/album/sublist'].data)
        imgToBlob(succ['/api/album/sublist'].cover + '?imageView=1&thumbnail=100x0', blur => { this.list.album.cover = blur }, 50, 0)
        this.$refs.firScroll.upEndSucc({ more: succ['/api/album/sublist'].hasMore })
      }).catch(err => {
        console.warn('获取收藏的专辑（error）：', err)
        this.$refs.firScroll.upEndErr()
      })
    },

    // 获取收藏的歌手
    artistSublist() {
      batchApi({
        batch: 'artist-sublist',
        limit: 1000,
        offset: this.list.artist.offset
      }).then(succ => {
        console.log('获取收藏的歌手（success）：', succ)
        this.list.artist.offset += 1000
        this.list.artist.data = this.list.artist.data.concat(succ['/api/artist/sublist'].data)
        this.$refs.secScroll.upEndSucc({ more: succ['/api/artist/sublist'].hasMore })
      }).catch(err => {
        console.warn('获取收藏的歌手（error）：', err)
        this.$refs.secScroll.upEndErr()
      })
    },

    // 获取收藏的视频
    mvSublist() {
      batchApi({
        batch: 'video-sublist',
        limit: 1000,
        offset: this.list.mv.offset
      }).then(succ => {
        console.log('获取收藏的视频（success）：', succ)
        this.list.mv.data = this.list.mv.data.concat(succ['/api/cloudvideo/allvideo/sublist'].data)
        this.list.mv.offset += 1000
        this.$refs.thirScroll.upEndSucc({ more: succ['/api/cloudvideo/allvideo/sublist'].hasMore })
      }).catch(err => {
        console.warn('获取收藏的视频（error）：', err)
        this.$refs.thirScroll.upEndErr()
      })
    },

    // 跳艺术家
    goArtist(id) {
      this.win.show = false
      this.$rmask()
      goArtist(id)
    },

    // 弹窗
    winFun(type, title, id, name) {
      this.$mask()
      this.win.id = id
      this.win.name = name
      this.win.type = type
      this.win.title = (type === 0 ? '专辑：' : type === 1 ? '歌手：' : type === 2 ? '视频：' : '') + title
    },

    // 播放量格式化
    formatCount(num) {
      if (num >= 0 && num < 100000) {
        return Math.floor(num)
      } else if (num >= 100000 && num < 100000000) {
        return Math.floor(num / 10000) + '万'
      } else if (num >= 100000000) {
        return (num / 100000000).toFixed(1) + '亿'
      } else {
        return 'err'
      }
    },

    // 总时长格式化
    durationFormat(duration) {
      let tempTotalTime = Math.floor(duration / 1000)
      let totalTimeMinute = Math.floor(Math.round(tempTotalTime) / 60) < 10 ? '0' + Math.floor(Math.round(tempTotalTime) / 60) : Math.floor(Math.round(tempTotalTime) / 60)
      let totalTimeSecond = Math.floor(tempTotalTime) % 60 < 10 ? '0' + Math.floor(tempTotalTime) % 60 : Math.floor(tempTotalTime) % 60
      return totalTimeMinute + ':' + totalTimeSecond
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.win.show) {
      this.$rmask()
      this.win.show = false
      return next(false)
    }
    next()
  }
}
</script>

<style lang="scss">
.collect-page {
  .nav {
    height: 90px;
    font-size: 30px;
    padding: 0 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      .back-icon {
        font-size: 35px;
        margin-right: 30px;
      }
    }
    .right {
      font-size: 35px;
    }
  }
  .sec-nav {
    height: 70px;
    display: flex;
    justify-content: space-between;
    padding: 0 50px;
    border-bottom: 1.5px solid #f5f5f5;
    li {
      line-height: 70px;
      text-align: center;
      position: relative;
      span:nth-child(2) {
        font-size: 15px;
        margin-bottom: -4px;
      }
      i {
        display: block;
        width: 2em;
        height: 4px;
        border-radius: 4px;
        font-weight: bold;
        position: absolute;
        left: 0;
        bottom: 0;
      }
    }
    .active {
      color: #ff3939;
      i {
        background: #ff3939;
      }
    }
  }
  .list {
    position: absolute;
    top: 160px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
    .albums {
      .line {
        width: 100%;
        height: 15px;
        background: #f5f5f5;
      }
      >p {
        padding: 25px 28px;
        span:last-child {
          color: #999;
          font-size: 20px;
        }
      }
      li {
        margin-bottom: 20px;
        display: flex;
        align-items: center;
        padding: 0 28px;
        .cover {
          margin-right: 20px;
          display: flex;
          align-items: center;
          div {
            width: 100px;
            height: 100px;
            border-radius: 10px;
            background: no-repeat center center / cover;
          }
          img:last-child {
            width: unset;
            height: 90px;
          }
        }
        .info {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          overflow: hidden;
          div {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            overflow: hidden;
            .name {
              margin-bottom: 10px;
            }
            .artist {
              color: #999;
              font-size: 20px;
            }
          }
          span {
            color: #999;
            flex-shrink: 0;
            font-size: 35px;
            margin-left: 30px;
          }
        }
      }
      li:first-child {
        margin: 10px 0;
        .cover {
          div {
            color: #d9d9d9;
            font-size: 55px;
            line-height: 100px;
            text-align: center;
            transition: background-image 0.4;
          }
        }
        .info {
          div {
            justify-content: center;
            p {
              color: #333;
            }
          }
        }
      }
    }
    .artists {
      padding-top: 10px;
      li {
        padding: 0 28px;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin-right: 20px;
          flex-shrink: 0;
          background: no-repeat center center / cover;
        }
        .info {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          div {
            p:first-child {
              margin-bottom: 10px;
            }
            p:last-child {
              color: #787878;
              font-size: 20px;
            }
          }
          >span {
            color: #999;
            font-size: 35px;
            margin-left: 30px;
          }
        }
      }
    }
    .videos {
      padding-top: 10px;
      li {
        padding: 0 28px;
        display: flex;
        align-items: center;
        margin-bottom: 20px;
        .cover {
          margin-right: 15px;
          flex-shrink: 0;
          position: relative;
          div {
            width: 230px;
            height: 130px;
            border-radius: 10px;
            background: no-repeat center center / cover;
          }
          span {
            color: #fff;
            width: 100%;
            text-align: right;
            box-shadow: 0px 20px 20px -8px rgba(0, 0, 0, 0.4) inset;
            position: absolute;
            top: 0;
            right: 0;
            padding: 6px 10px;
            border-radius: 8px;
            font-size: 20px;
          }
        }
        .info {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          div {
            p:first-child {
              margin-bottom: 10px;
              .mv-icon {
                color: #ff3939;
                display: inline-block;
                width: 35px;
                height: 25px;
                text-align: center;
                line-height: 23px;
                border: 1.5px solid rgba(255, 57, 57, 0.5);
                border-radius: 4px;
                font-size: 15px;
                margin-right: 8px;
              }
            }
            p:last-child {
              color: #787878;
              font-size: 20px;
            }
          }
          >span {
            color: #999;
            font-size: 35px;
            margin-left: 30px;
          }
        }
      }
    }
  }
  .win {
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
    background: #fff;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 11;
    transition: transform .2s;
    .title {
      color: #5a5a5a;
      display: block;
      font-size: 22px;
      border-bottom: 1.5px solid #f5f5f5;
      padding-right: 28px;
    }
    li {
      line-height: 85px;
      padding-left: 28px;
      display: flex;
      span:first-child {
        font-size: 40px;
        margin-right: 20px;
      }
      span:last-child {
        display: inline-block;
        width: 100%;
        height: 100%;
        border-bottom: 1.5px solid #f5f5f5;
      }
    }
  }
}
</style>
