<template>
  <div id="app" @click="fullScreen()">
    <sound></sound>
    <navigation v-if="this.$route.path === '/homepage'"></navigation>
    <transition name="fade">
      <simple v-if="getWindows('simple') !== null"></simple>
    </transition>
    <transition name="slide-left">
      <left v-if="getWindows('left')"></left>
    </transition>
    <transition name="slide-top">
      <info v-if="getWindows('info')"></info>
      <list v-if="getWindows('list')"></list>
    </transition>
    <!-- <transition name="slide-top"> -->
    <router-view v-if="isRouterAlive"></router-view>
    <!-- </transition> -->
    <bar v-if="!/description|update|player|login|email|cellphone|playlist-edit|comments|my-details/i.test(this.$route.path) && getGLOBAL('playIndex') !== null"></bar>
  </div>
</template>

<script>
import bar from '@/views/bar'
import left from '@/views/window/left'
import list from '@/views/window/list'
import info from '@/views/window/info'
import sound from '@/views/audio'
import simple from '@/views/window/simple'
import navigation from '@/views/homepage/navigation'
import { getGLOBAL, getWindows } from './utils/store'

export default {
  name: 'app',
  components: { bar, left, list, info, sound, simple, navigation },
  data() {
    return {
      // 方法
      getGLOBAL,
      getWindows,
      // 数据
      clickTimes: 0,
      isRouterAlive: true
    }
  },
  provide() {
    return {
      reload: this.reload
    }
  },
  methods: {
    // 三击全屏
    fullScreen() {
      this.clickTimes++
      clearTimeout(this.screenTimeOut)
      this.screenTimeOut = setTimeout(() => {
        this.clickTimes = 0
      }, 200)
      if (this.clickTimes === 3) {
        this.$fullscreen.toggle(document.body, {
          wrap: false,
          callback: this.fullscreenChange()
        })
      }
    },
    fullscreenChange(fullscreen) {
      this.fullscreen = fullscreen
    },

    // 页面重载
    reload() {
      this.isRouterAlive = false
      this.$nextTick(() => {
        this.isRouterAlive = true
      })
    }
  }
}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  outline: none;
  list-style: none;
  text-decoration: none;
  box-sizing: border-box;
  font-family: 'iconfont';
  -webkit-tap-highlight-color: transparent;
  -moz-tap-highlight-color: transparent;
  -webkit-overflow-scrolling: touch;
  -moz-overflow-scrolling: touch;
  -webkit-touch-callout: none;
  -moz-touch-callout: none;
  user-select: none;    // IOS 无法获取焦点
  -ms-overflow-style: none;         // IE 隐藏滚动条
  overflow: -moz-scrollbars-none;   // FireFox 隐藏滚动条
}
*::-webkit-scrollbar { // webkit 隐藏滚动条
  display: none;
}
html, body {
  color: #333;
  width: 100%;
  height: 100%;
  max-width: 550PX;
  margin: 0 auto;
  overflow: hidden;
  line-height: 1.4;
  position: relative;
  white-space: normal;
  word-wrap: break-word;
  word-break: break-word;
  background: rgba(0, 0, 0, 0.5);
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  // font-family: sans-serif, tahoma, arial, 'Hiragino Sans GB';
  font-family: HanHei SC, PingFang SC, Helvetica Neue, Helvetica, sans-serif;
}
@font-face {
  font-family: "iconfont";
  src: url("./assets/iconfont/iconfont.ttf");
}
*::selection {
  background: rgba(218, 43, 31, 0.3);
}
*::-moz-selection {
  background: rgba(218, 43, 31, 0.3);
}
*::-webkit-selection {
  background: rgba(218, 43, 31, 0.3);
}
.no-scroll-bar {
  -ms-overflow-style: none;         // IE 隐藏滚动条
  overflow: -moz-scrollbars-none;   // FireFox 隐藏滚动条
}
.no-scroll-bar::-webkit-scrollbar { // webkit 隐藏滚动条
  display: none;
}
.one-line-ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.two-line-ellipsis {
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  /*! autoprefixer: off */
}
img {
  width: 100%;
  display: block;
}
input {
  width: 100%;
  height: 100%;
}
button, input {
  border: none;
  background: transparent;
}
input, textarea {
  user-select: text !important;
  -webkit-touch-callout: default !important;
  -moz-touch-callout: default !important;
}
#app {
  width: 100%;
  height: 100%;
  font-size: 25px;
  background: #fff;
  transform: translate3d(0, 0, 0);
  .web-page {
    position: absolute;
    top :0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
// simple
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
// 左弹窗
.slide-left-enter-active {
  animation: left-win .2s;
}
.slide-left-leave-active {
  animation: left-win .2s reverse;
}
@keyframes left-win {
  from { transform: translate3d(-100%, 0px, 0px) }
  to { transform: translate3d(0px, 0px, 0px) }
}
// 上拉窗
.slide-top-enter-active {
  animation: top-win .2s;
}
.slide-top-leave-active {
  animation: top-win .2s reverse;
}
@keyframes top-win {
  from { transform: translate3d(0px, 100%, 0px) }
  to { transform: translate3d(0px, 0px, 0px) }
}
// 小组件
.loading {
  color: gray;
  width: 100%;
  text-align: center;
  span {
    display: inline-block;
    line-height: 85px;
    padding-left: 40px;
    background: url('./assets/img/loading.svg') no-repeat center left / 35px auto;
  }
}
.net-err, .empty {
  color: gray;
  line-height: 85px;
  text-align: center;
}
.placeholder {
  width: 100%;
  height: 90px;
}
// toast、mask
.toast-show, .mask-show {
  animation: opacity-show .2s linear;
}
.toast-hide, .mask-hide {
  animation: opacity-hide .2s linear;
}
.toast-top {
  top: 40px;
}
.toast-center {
  top: 50%;
  margin-top: -45px;
}
.toast-bottom {
  bottom: 60px;
}
@keyframes opacity-show {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes opacity-hide {
  from { opacity: 1; }
  to { opacity: 0; }
}
</style>
