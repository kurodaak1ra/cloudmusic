<template>
  <div v-if="getGLOBAL('musicList').length !== 0" class="player-page web-page" :style="{ backgroundImage: `url(${getGLOBAL('player').coverUrlBlob})` }">
    <div class="nav">
      <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
      <div class="title" @click="goArtist(getMusicList().artist)">
        <marquee scrollamount="3" class="name">{{getMusicList().song.name + (getMusicList().alia.length === 0 ? '' : `（${getMusicList().alia.toString().replace(/,/g, '/')}）`)}}</marquee>
        <p class="artist one-line-ellipsis"><template v-for="(i, index) in getMusicList().artist">{{i.name + (getMusicList().artist.length - 1 === index ? '' : '/')}}</template></p>
      </div>
      <span ref="share" @click="share()">&#xe674;</span>
    </div>
    <!-- 主 cover -->
    <div class="main-cover" :style="{ transform: isCoverPage ? 'translate3d(0px, 0px, 0px)' : 'translate3d(100%, 0px, 0px)' }" @click.stop="isCoverPage = false">
      <div class="needle" :style="{ transform: getGLOBAL('audio').isPlaying && needleDown ? 'rotate(0deg)' : 'rotate(-25deg)' }">
        <img src="../assets/img/player/needle.svg" alt="">
      </div>
      <div class="swiper-container cover-swiper" :class="{ 'swiper-no-swiping': canNotSlide }">
        <div class="half-transparent-bg"></div>
        <div class="swiper-wrapper">
          <div v-for="(i, index) in getGLOBAL('player').coverSwiperList" :key="index" class="swiper-slide">
            <div class="cover" :class="{ 'rotate': i.song.id === getGLOBAL('playingId') && (getGLOBAL('audio').isPlaying || getGLOBAL('audio').currentTime > 0) }" :style="{ animationPlayState: getGLOBAL('audio').isPlaying && !getGLOBAL('audio').isLoading ? 'running' : 'paused' }" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
              <div :style="{ backgroundImage: `url(${i.album.blob === '' ? getGLOBAL('1px')['transparent'] : i.album.blob})` }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 主 歌词 -->
    <div class="main-lyric" :style="{ transform: isCoverPage ? 'translate3d(100%, 0px, 0px)' : 'translate3d(0px, 0px, 0px)' }">
      <div class="sound-control">
        <span>&#xe679;</span>
        <div ref="volumeBar" class="bar" @touchmove="volumeControl($event)">
          <div class="line">
            <span :style="{ width: volume + '%' }"></span>
          </div>
          <i class="slider" :style="{ left: volume + '%' }"></i>
        </div>
      </div>
      <div class="lyric-container" @click.stop="isCoverPage = true">
        <BScroll ref="bsc" class="lyric">
          <ul class="list">
            <li v-for="(val, key, index) in getGLOBAL('player').lyricList.lyric" :key="index" :style="{ color: lyricActiveIndex === index ? 'rgb(255, 255, 255)' : 'rgba(255, 255, 255, 0.5)' }">
              <p class="lrc">{{val.lrc}}</p>
              <p v-if="getGLOBAL('player').lyricList.tlrc" class="tlrc">{{val.tlrc}}</p>
            </li>
          </ul>
        </BScroll>
      </div>
    </div>
    <!-- 控制区 -->
    <div class="controls">
      <div v-if="isCoverPage" class="area-1">
        <span :style="{ color: getGLOBAL('likeList').indexOf(getGLOBAL('playingId')) === -1 ? '#fff' : '#dd4137' }" @click="like()">{{getGLOBAL('likeList').indexOf(getGLOBAL('playingId')) === -1 ? '&#xe684;' : '&#xe683;'}}</span>
        <span @click="1">&#xe673;</span>
        <span @click="2">&#xe687;</span>
        <span class="comments" @click="goComments()">{{getGLOBAL('player').comments === 0 ? '&#xe675;' : '&#xe685;'}}<span v-if="getGLOBAL('player').comments !== 0">{{getGLOBAL('player').comments}}</span></span>
        <span @click="SET_PAGE_DATA(['info', 'id', getGLOBAL('playingId')]);SET_WINDOWS(['info', true])">&#xe686;</span>
      </div>
      <div class="area-2">
        <span class="past-time">{{pastTime}}</span>
        <div ref="processBar" class="bar" @touchstart="processControlStart($event)" @touchmove="processControlMove($event)" @touchend="processControlEnd($event)">
          <div class="line">
            <span class="process" :style="{ width: process + '%' }"></span>
            <span class="buffered" :style="{ width: getGLOBAL('audio').buffered + '%' }"></span>
          </div>
          <i :class="canSetProcessBar ? 'slider' : 'slider-touch'" :style="{ left: process + '%', animationName: getGLOBAL('audio').isLoading ? 'breathe' : '' }"></i>
        </div>
        <span class="total-time">{{getGLOBAL('audio').totalTime}}</span>
      </div>
      <div class="area-3">
        <span @click="loop()" v-html="getGLOBAL('audio').loopType === 0 ? '&#xe67f;' : getGLOBAL('audio').loopType === 1 ? '&#xe680;' : getGLOBAL('audio').loopType === 2 ? '&#xe682;' : ''"></span>
        <span @click="prevMusic()">&#xe67b;</span>
        <span @click="playPause()" v-html="getGLOBAL('audio').isPlaying ? '&#xe67d;' : '&#xe67e;'"></span>
        <span @click="nextMusic()">&#xe67a;</span>
        <span @click="SET_WINDOWS(['list', true])">&#xe67c;</span>
      </div>
    </div>
    <!-- cover 大图 -->
    <div v-if="coverFullScreen" class="cover-full-screen" @click="coverFullScreen = false">
      <img :src="getMusicList().album.pic" alt="">
      <a href="javascript:void(0)" @click.stop="downloadByBlob(getMusicList().album.pic, `${getMusicList().album.name}_${getMusicList().album.picId}`)">保存图片</a>
    </div>
    <!-- 循环方式弹窗 -->
    <div v-if="loopTips" class="loop-tips" :style="{ opacity: loopTipsOpacity ? '1' : '0' }" v-html="getGLOBAL('audio').loopType === 0 ? '顺序播放' : getGLOBAL('audio').loopType === 1 ? '随机播放' : getGLOBAL('audio').loopType === 2 ? '单曲循环' : ''"></div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import BScroll from './plugins/bscroll'
import Clipboard from 'clipboard'
import { mapMutations } from 'vuex'
import { likeApi } from '../utils/api'
import { downloadByBlob } from '../utils/tools'
import { getGLOBAL, getMusicList } from '../utils/store'
import { goArtist, goComments } from '../utils/function'

export default {
  name: 'player',
  components: { BScroll },
  data() {
    return {
      // 方法
      getGLOBAL,
      getMusicList,
      downloadByBlob,
      goArtist,
      // 数据
      coverFullScreen: false,
      canNotSlide: false,
      isCoverPage: true,
      needleDown: true,
      pastTime: '00:00',
      process: 0,
      volume: 50,
      lyricActiveIndex: null,
      canSetProcessBar: true,
      loopTips: false,
      loopTipsOpacity: false
    }
  },
  watch: {
    // 监听 cover swiper
    '$store.state.GLOBAL.player.coverSwiperList'(newer, older) {
      this.coverSlide()
    },
    // 监听 lyric target
    '$store.state.GLOBAL.player.lyricTarget'(newer, older) {
      this.$refs.bsc.scrollToElement(`li:nth-child(${newer + 1})`, 500, true, true)
      setTimeout(() => { this.lyricActiveIndex = newer }, 50)
    },
    // 监听 current time
    '$store.state.GLOBAL.audio.currentTime'(newer, older) {
      let pastTimeMinute = Math.floor(Math.round(newer) / 60) < 10 ? '0' + Math.floor(Math.round(newer) / 60) : Math.floor(Math.round(newer) / 60)
      let pastTimeSecond = Math.floor(newer) % 60 < 10 ? '0' + Math.floor(newer) % 60 : Math.floor(newer) % 60
      this.pastTime = pastTimeMinute + ':' + pastTimeSecond
      if (this.canSetProcessBar) this.process = newer / Math.ceil(getMusicList().duration / 1000) * 100 >= 100 ? 100 : newer / Math.ceil(getMusicList().duration / 1000) * 100
    },
    // 监听 auto next
    '$store.state.GLOBAL.trigger.autoNext'(newer, older) {
      this.needleAnimation()
      this.swiper.slideNext()
    }
  },
  mounted() {
    // swiper
    this.swiper = new Swiper('.cover-swiper', {
      loop: false,
      observer: true,
      observeParents: true,
      on: {
        init: () => {
          setTimeout(() => { this.coverSlide() })   // 拉到当前 cover，不设延时会报错
        },
        slidePrevTransitionEnd: () => {
          this.setChangeTimeout()
          this.SET_PAGE_DATA(['trigger', 'prevPiece', !getGLOBAL('trigger').prevPiece])
        },
        slideNextTransitionEnd: () => {
          this.setChangeTimeout()
          this.SET_PAGE_DATA(['trigger', 'nextPiece', !getGLOBAL('trigger').nextPiece])
        },
        touchMove: () => {
          this.needleDown = false
        },
        touchEnd: () => {
          this.needleDown = true
        }
      }
    })

    // 初始化定位歌词
    if (getGLOBAL('player').lyricTimeLine.length !== 0) {
      this.lyricActiveIndex = getGLOBAL('player').lyricTarget
      this.$refs.bsc.scrollToElement(`li:nth-child(${getGLOBAL('player').lyricTarget + 1})`, 0, true, true)
    }

    // 分享
    this.clipboard = new Clipboard(this.$refs.share, {
      text: () => {
        let tempArtist = []
        for (let i = 0; i < getMusicList().artist.length; i++) {
          tempArtist.push(getMusicList().artist[i].name)
        }
        if (getGLOBAL('isLogin')) {
          return `分享${tempArtist.toString().replace(/,/g, '/')}的单曲《${getMusicList().song.name + (getMusicList().alia === undefined ? '' : `(${getMusicList().alia})`)}》: http://music.163.com/song/${getGLOBAL('playingId')}/userid=${getGLOBAL('userInfo').uid} (来自@网易云音乐 Write by KA)`
        } else {
          return `分享${tempArtist.toString().replace(/,/g, '/')}的单曲《${getMusicList().song.name + (getMusicList().alia === undefined ? '' : `(${getMusicList().alia})`)}》: http://music.163.com/song/${getGLOBAL('playingId')} (来自@网易云音乐 Write by KA)`
        }
      }
    })
  },
  methods: {
    ...mapMutations([
      'SET_GLOBAL',
      'SET_WINDOWS',
      'SET_PAGE_DATA'
    ]),

    // 喜欢
    like() {
      let indexOf = getGLOBAL('likeList').indexOf(getGLOBAL('playingId'))
      likeApi({
        id: getGLOBAL('playingId'),
        like: indexOf === -1 ? true : ''
      }).then(succ => {
        console.log('喜欢（success）：', succ)
        let tempLikeList = getGLOBAL('likeList')
        if (indexOf === -1) {
          tempLikeList.push(getGLOBAL('playingId'))
          this.SET_GLOBAL(['likeList', tempLikeList])
        } else {
          tempLikeList.splice(indexOf, 1)
          this.SET_GLOBAL(['likeList', tempLikeList])
        }
      }).catch(err => {
        console.warn('喜欢（error）：', err)
      })
    },

    // 循环
    loop() {
      clearTimeout(this.loopTimeOut_0)
      clearTimeout(this.loopTimeOut_1)
      clearTimeout(this.loopTimeOut_2)
      this.SET_PAGE_DATA(['audio', 'loopType', getGLOBAL('audio').loopType + 1])
      if (getGLOBAL('audio').loopType > 2) this.SET_PAGE_DATA(['audio', 'loopType', 0])
      this.loopTips = true
      this.loopTimeOut_0 = setTimeout(() => {
        this.loopTipsOpacity = true
      }, 0)
      this.loopTimeOut_1 = setTimeout(() => {
        this.loopTipsOpacity = false
      }, 3000)
      this.loopTimeOut_2 = setTimeout(() => {
        this.loopTips = false
      }, 3500)
    },

    // 评论
    goComments() {
      let tempArtist = []
      for (let i = 0; i < getMusicList().artist.length; i++) {
        tempArtist.push(getMusicList().artist[i].name)
      }
      goComments(
        0,
        getGLOBAL('playingId'),
        getMusicList().artist,
        getMusicList().song.name + (getMusicList().alia === undefined ? '' : `（${getMusicList().alia}）`),
        tempArtist.toString().replace(/,/g, '/'),
        getMusicList().album.blob
      )
    },

    // 上一曲
    prevMusic() {
      if (this.canNotSlide) return
      this.needleAnimation()
      this.swiper.slidePrev()
    },
    // 播放
    playPause() {
      if (!window.navigator.onLine) {
        this.$toast('网络已断开连接')
        return
      }
      if (getGLOBAL('audio').isPlaying) {
        this.SET_PAGE_DATA(['audio', 'isPlaying', false])
      } else {
        this.SET_PAGE_DATA(['audio', 'isPlaying', true])
      }
    },
    // 下一曲
    nextMusic() {
      if (this.canNotSlide) return
      this.needleAnimation()
      this.swiper.slideNext()
    },

    // 歌词位移
    lyricSlide(time) {
      let currentLyricIndex = getGLOBAL('player').lyricTimeLine.indexOf(Math.floor(time * 10))
      if (currentLyricIndex !== -1) {
        this.$refs.bsc.scrollToElement(`li:nth-child(${currentLyricIndex + 1})`, 500, true, true)
        setTimeout(() => { this.lyricActiveIndex = currentLyricIndex }, 50)
      }
    },

    // 切歌唱针动画
    needleAnimation() {
      if (getGLOBAL('audio').isPlaying) {
        this.needleDown = false
        setTimeout(() => {
          this.needleDown = true
        }, 350)
      } else {
        this.needleDown = true
      }
    },

    // cover 大图显示
    onTouchStart() {
      this.coverFullScreenFlag = true
      setTimeout(() => {
        if (this.coverFullScreenFlag) {
          this.$loading()
          this.coverFullScreen = true
          // imgToBlob(getMusicList().album.pic)
          this.$rloading()
        }
      }, 500)
    },
    onTouchMove() {
      this.coverFullScreenFlag = false
    },
    onTouchEnd() {
      this.coverFullScreenFlag = false
    },

    // 音量
    volumeControl(ev) {
      let barOffsetWidth = this.$refs.volumeBar.offsetWidth
      let slideLength = Math.floor(ev.touches[0].clientX) - this.$refs.volumeBar.offsetLeft
      if (slideLength <= 0) {
        this.volume = 0
        this.SET_PAGE_DATA(['audio', 'volume', 0])
      } else if (slideLength > 0 && slideLength < barOffsetWidth) {
        let slidePercent = slideLength / barOffsetWidth
        this.volume = Math.floor(slidePercent * 100)
        this.SET_PAGE_DATA(['audio', 'volume', slidePercent.toFixed(2)])
      } else if (slideLength >= barOffsetWidth) {
        this.volume = 100
        this.SET_PAGE_DATA(['audio', 'volume', 1])
      }
    },

    // 进度条
    processControlStart(ev) {
      this.canSetProcessBar = false
      let barOffsetWidth = this.$refs.processBar.offsetWidth
      let slideLength = Math.floor(ev.touches[0].clientX) - this.$refs.processBar.offsetLeft
      let slidePercent = slideLength / barOffsetWidth
      this.process = Math.floor(slidePercent * 100)
      this.tempCurrentTime = Math.floor(getMusicList().duration / 1000 * slidePercent)
    },
    processControlMove(ev) {
      let barOffsetWidth = this.$refs.processBar.offsetWidth
      let slideLength = Math.floor(ev.touches[0].clientX) - this.$refs.processBar.offsetLeft
      if (slideLength <= 0) {
        this.process = 0
        this.tempCurrentTime = 0
        this.$refs.bsc.scrollToElement('.lyric .list li:nth-child(1)', 500, true, true)
      } else if (slideLength > 0 && slideLength < barOffsetWidth) {
        let slidePercent = slideLength / barOffsetWidth
        this.process = Math.floor(slidePercent * 100)
        this.tempCurrentTime = Math.floor(getMusicList().duration / 1000 * slidePercent)
      } else if (slideLength >= barOffsetWidth) {
        this.process = 100
        this.tempCurrentTime = Math.floor(getMusicList().duration / 1000)
        this.$refs.bsc.scrollToElement(`.lyric .list li:nth-child(${getGLOBAL('player').lyricTimeLine.length})`, 500, true, true)
      }
    },
    processControlEnd(ev) {
      this.canSetProcessBar = true
      this.SET_PAGE_DATA(['trigger', 'process', this.tempCurrentTime])
    },
    setChangeTimeout() {
      this.canNotSlide = true
      setTimeout(() => {
        this.canNotSlide = false
      }, 500)
    },

    // cover 跳当前播放
    coverSlide() {
      if (getGLOBAL('playIndex') === 0) {
        this.swiper.slideTo(0, 0, false)
      } else {
        this.swiper.slideTo(1, 0, false)
      }
    },

    // 分享
    share() {
      this.clipboard.on('success', e => {
        this.$toast('分享链接复制成功')
      })
      this.clipboard.on('error', e => {
        this.$toast('浏览器不支持自动复制')
      })
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.coverFullScreen) {
      this.coverFullScreen = false
      return next(false)
    }
    next()
  }
}
</script>

<style lang="scss">
.player-page {
  transition: background-image .4s;
  background: no-repeat center center / cover;
  // 导航
  .nav {
    color: #fff;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    >span {
      font-size: 40px;
    }
    .title {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      margin: 0 30px;
      overflow: hidden;
      .name {
        font-size: 30px;
      }
      .artist {
        opacity: 0.6;
        font-size: 23px;
      }
    }
  }
  // 主 cover
  .main-cover {
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 350px;
    .needle {
      width: 170px;
      position: absolute;
      top: 0;
      left: 50%;
      z-index: 2;
      margin-left: -30px;
      overflow: hidden;
      transition: transform 0.25s linear;
      transform-origin: 30px 30px;
    }
    .swiper-container {
      margin-top: 145px;
      .half-transparent-bg {
        width: 565px;
        height: 565px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        position: absolute;
        left: 50%;
        margin-left: -282.5px;
      }
      .cover {
        width: 565px;
        height: 565px;
        margin: 0 auto;
        padding: 97px;
        overflow: hidden;
        border-radius: 50%;
        background: url('../assets/img/player/cover-bg.svg') no-repeat center center / cover;
        div {
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 50%;
          background: no-repeat center center / cover;
        }
      }
      .rotate {
        animation: cover_rotate_keyframes 15s infinite linear;
      }
      @keyframes cover_rotate_keyframes {
        from {
          transform: rotate(0deg);
        } to {
          transform: rotate(360deg);
        }
      }
    }
  }
  // 主歌词
  .main-lyric {
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 260px;
    text-align: center;
    overflow: hidden;
    .sound-control {
      color: rgba(255, 255, 255, 0.8);
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 60px 0 40px;
      font-size: 20px;
      .bar {
        width: 100%;
        height: 8PX;
        display: flex;
        align-items: center;
        position: relative;
        margin-left: 25px;
        .line {
          width: 100%;
          height: 2PX;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.2);
          span {
            display: block;
            width: 50%;
            height: 100%;
            background: rgba(255, 255, 255, 0.5);
          }
        }
        .slider {
          width: 8PX;
          height: 8PX;
          border-radius: 50%;
          background: #fff;
          position: absolute;
          top: 0;
          left: 50%;
          margin-left: -3PX;
        }
      }
    }
    .lyric-container {
      position: absolute;
      top: 2em;
      left: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      display: flex;
      align-items: center;
      padding: 0 2em;
      .lyric {
        width: 100%;
        height: 1PX;
        background: rgba(255, 255, 255, 0.1);
        .list {
          li {
            color: rgba(255, 255, 255, 0.5);
            font-size: 28px;
            margin: 45px 0;
          }
          li:first-child {
            margin: 0 0 45px;
          }
        }
      }
    }
  }
  // 控制区
  .controls {
    width: 100%;
    position: absolute;
    bottom: 30px;
    z-index: 2;
    .area-1 {
      color: #fff;
      width: 100%;
      padding: 0 120px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 42px;
      .comments {
        position: relative;
        span {
          position: absolute;
          top: 0;
          left: 70%;
          font-size: 15px;
          white-space: nowrap;
        }
      }
    }
    .area-2 {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 45px 0 35px;
      padding: 0 30px;
      .past-time {
        color: rgba(255, 255, 255, 0.8);
      }
      .total-time {
        color: rgba(255, 255, 255, 0.4);
      }
      .past-time, .total-time {
        width: 3em;
        font-size: 15px;
        text-align: center;
        flex-shrink: 0;
      }
      .bar {
        width: 100%;
        height: 6PX;
        position: relative;
        margin: 0 15px;
        .line {
          height: 2PX;
          background: rgba(255, 255, 255, 0.2);
          position: absolute;
          top: 2PX;
          left: 0;
          right: 0;
          border-radius: 2px;
          overflow: hidden;
          span {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
          }
          span:last-child {
            transition: width .3s;
          }
          .process {
            background: rgba(255, 255, 255, 0.8);
          }
          .buffered {
            background: rgba(255, 255, 255, 0.4);
          }
        }
        .slider {
          width: 6PX;
          height: 6PX;
          border-radius: 50%;
          background: #fff;
          position: absolute;
          top: 0;
          left: 0;
          margin-left: -3PX;
          animation: 1.5s linear infinite;
        }
        .slider-touch {
          width: 11PX;
          height: 11PX;
          border-radius: 50%;
          background: #fff;
          position: absolute;
          top: -3PX;
          left: 0;
          margin-left: -11px;
        }
        @keyframes breathe {
          0% {background: #ffffff}
          50% {background: #db2c1f}
          100% {background: #ffffff}
        }
      }
    }
    .area-3 {
      color: #fff;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 0 10%;
      font-size: 40px;
      span:nth-child(2) {
        margin-left: 25px;
      }
      span:nth-child(3) {
        font-size: 100px;
      }
      span:nth-child(4) {
        margin-right: 25px;
      }
    }
  }
  // 全屏 cover
  .cover-full-screen {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    background: #000;
    display: flex;
    align-items: center;
    a {
      color: #fff;
      width: 6em;
      position: absolute;
      left: 50%;
      bottom: 50px;
      line-height: 50px;
      margin-left: -3em;
      text-align: center;
      border-radius: 50PX;
      border: 1.5px solid #fff;
    }
  }
  // 循环方式
  .loop-tips {
    width: 190px;
    height: 85px;
    position: absolute;
    left: 50%;
    bottom: 45px;
    z-index: 12;
    margin-left: -95px;
    line-height: 85px;
    border-radius: 45px;
    text-align: center;
    opacity: 0;
    background: rgba(255, 255, 255, 0.8);
    transition: opacity 0.5s linear;
    box-shadow: 0px 0px 10px 0px #000;
  }
}
</style>
