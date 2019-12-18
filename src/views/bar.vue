<template>
  <div class="music-bar">
    <div class="swiper-container bar-swiper" :class="{ 'swiper-no-swiping': canNotSlide }" @click="$router.push({ path: '/player' })">
      <div class="swiper-wrapper">
        <div v-for="(i, index) in getGLOBAL('player').coverSwiperList" :key="index" class="swiper-slide">
          <div class="cover">
            <div :style="{ backgroundImage: `url(${i.album.blob === '' ? getGLOBAL('1px')['transparent'] : (i.album.pic + '?imageView=1&thumbnail=65x0')})` }"></div>
          </div>
          <div class="info">
            <marquee scrollamount="3">{{i.song.name + (i.alia.length === 0 ? '' : `（${i.alia.toString().replace(/,/g, '/')}）`)}}</marquee>
            <p class="one-line-ellipsis"><template v-for="(j, jndex) in i.artist">{{j.name + (i.artist.length - 1 === jndex ? '' : '/')}}</template></p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <div ref="playPause" @click="playPause()">
        <svg xmlns="http://www.w3.org/2000/svg">
          <circle class="c1" cx="50%" cy="50%" r="40%" stroke-width="1" stroke-dashoffset="0%" :style="{ stroke: getGLOBAL('isPlaying') ? '#ccc' : '#4d4d4d' }"></circle>
          <circle class="c2" cx="50%" cy="50%" r="40%" stroke-width="1" :stroke-dashoffset="circlePress + '%'"></circle>
        </svg>
        <span :style="{ color: getGLOBAL('audio').isPlaying ? '#ff3a3a' : '#4d4d4d' }" v-html="getGLOBAL('audio').isPlaying ? '&#xe689;' : '&#xe68a;'"></span>
      </div>
      <span @click="slideWin()">&#xe67c;</span>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import { mapMutations } from 'vuex'
import { getGLOBAL, getMusicList } from '../utils/store'

export default {
  name: 'bar',
  data() {
    return {
      // 方法
      getGLOBAL,
      // 数据
      canNotSlide: false,
      circlePress: 255
    }
  },
  watch: {
    '$store.state.GLOBAL.player.coverSwiperList'(newer, older) {
      this.coverSlide()
    },
    '$store.state.GLOBAL.audio.currentTime'(newer, older) {
      let process = newer / Math.ceil(getMusicList().duration / 1000) * 100 >= 100 ? 100 : newer / Math.ceil(getMusicList().duration / 1000) * 100
      this.circlePress = 255 - 255 * (process / 100)
    }
  },
  mounted() {
    this.swiper = new Swiper('.bar-swiper', {
      loop: false,
      autoplay: false,
      observer: true,
      observeParents: true,
      on: {
        slidePrevTransitionEnd: () => {
          this.setChangeTimeout()
          this.SET_PAGE_DATA(['trigger', 'prevPiece', !getGLOBAL('trigger').prevPiece])
        },
        slideNextTransitionEnd: () => {
          this.setChangeTimeout()
          this.SET_PAGE_DATA(['trigger', 'nextPiece', !getGLOBAL('trigger').nextPiece])
        }
      }
    })
    this.coverSlide()
  },
  methods: {
    ...mapMutations([
      'SET_GLOBAL',
      'SET_WINDOWS',
      'SET_PAGE_DATA'
    ]),

    // 弹出歌曲列表上拉窗
    slideWin() {
      this.SET_WINDOWS(['list', true])
    },

    // 播放暂停
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

    // 连续切换卡 0.5s
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
    }
  }
}
</script>

<style lang="scss">
.music-bar {
  color: #323232;
  height: 90px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1.5px solid #f5f5f5;
  .swiper-container {
    width: 100%;
    margin-right: 15px;
  }
  .swiper-slide {
    display: flex;
    align-items: center;
    .cover {
      margin-right: 10px;
      flex-shrink: 0;
      margin-left: 12px;
      background: url('../assets/img/player/cover-bg.svg') no-repeat center center / cover;
      div {
        width: 65px;
        height: 65px;
        border-radius: 50%;
        transition: opacity 1s linear;
        background: no-repeat center center / cover;
      }
    }
    .info {
      width: 100%;
      font-size: 23px;
      overflow: hidden;
      position: relative;
      p {
        color: #999;
        font-size: 20px;
      }
    }
    .info::before {
      content: '';
      width: 30px;
      height: 1.5em;
      position: absolute;
      top: 0;
      left: 0;
      background: linear-gradient(to right, rgb(255, 255, 255), transparent);
    }
    .info::after {
      content: '';
      width: 30px;
      height: 1.5em;
      position: absolute;
      top: 0;
      right: 0;
      background: linear-gradient(to left, rgb(255, 255, 255), transparent);
    }
  }
  >div:last-child {
    font-size: 40px;
    flex-shrink: 0;
    margin-right: 12px;
    display: flex;
    align-items: center;
    div {
      width: 55px;
      height: 55px;
      margin-right: 35px;
      position: relative;
      svg {
        width: 100%;
        height: 100%;
        fill: none;
        stroke-dasharray: 255%;
        stroke-dashoffset: 255%;
        transform: rotate(-90deg);
      }
      .c1 {
        stroke: #4d4d4d;
      }
      .c2 {
        stroke: #ff3a3a;
      }
      span {
        width: 100%;
        text-align: center;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        font-size: 55px;
        line-height: 55px;
      }
    }
  }
}
</style>
