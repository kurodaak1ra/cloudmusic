<template>
  <div ref="scroll" class="scroll" :style="{ overflow: scrollBlock ? 'hidden' : 'auto' }">
    <!-- 下拉刷新动画 -->
    <div v-if="up.hasOwnProperty('downRefresh')" class="pull-refresh" :class="{ 'refresh-ani': touchEnd }" :style="{ transform: `translate3d(0px, ${slideLength}px, 0px)` }">
      <div>
        <div v-if="!touchEnd" class="static-loading">
          <img class="out" :style="{ transform: `rotate(${slideLength * 2.5}deg)` }" src="../../assets/img/found/loading-out.svg" alt="">
          <img class="in" :style="{ transform: `rotate(${-slideLength * 2.5}deg)` }" src="../../assets/img/found/loading-in.svg" alt="">
        </div>
        <div v-else class="ani-loading">
          <img src="../../assets/img/found/loading.svg" alt="">
        </div>
      </div>
    </div>
    <!-- tips -->
    <div v-if="up.hasOwnProperty('downRefresh')" class="tips" :style="{ transform: `translate3d(0px, ${tipsAni}px, 0px)` }">
      <span>{{up.downRefresh.tips}}</span>
    </div>
    <!-- 插槽 -->
    <div>
      <slot></slot>
    </div>
    <!-- 小组件 -->
    <div class="components" :style="{ paddingTop: firstIn || empty || netErr ? '1.5rem' : '0' }">
      <div v-if="!netErr && !empty && more" class="loading" :style="{ opacity: loading ? 1 : 0 }">
        <span>努力加载中...</span>
      </div>
      <div v-else-if="empty" class="empty">
        <p>{{up.empty}}</p>
      </div>
      <div v-else-if="netErr" class="net-err">
        <p @click="call()">加载失败，请点击重试</p>
      </div>
      <div v-if="getGLOBAL('playIndex') !== null || (/comments/i.test(this.$route.path) && up.placeholder)" class="placeholder"></div>
    </div>
  </div>
</template>

<script>
import { getGLOBAL } from '../../utils/store'

export default {
  name: 'scroll',
  props: {
    up: {
      type: Object,
      default: {
        empty: '',
        auto: true,
        callback: null,
        onScroll: null,
        downRefresh: false,
        placeholder: false
      }
    }
  },
  data() {
    return {
      // 方法
      getGLOBAL,
      // 数据
      firstIn: true,
      scrollY: 0,
      isUp: true,
      upEnd: true,  // 触底事件结束标识
      loading: false,
      netErr: false,
      more: true,
      empty: false,
      // loading
      isTop: true,
      touchStart: 0,
      touchEnd: true,
      slideLength: 0,
      refreshing: false,
      refreshReady: false,
      scrollBlock: false,
      startBlock: false,
      tipsAni: 0
    }
  },
  watch: {
    'up.downRefresh.reqEnd'(newer, older) {
      if (!newer) return
      // loading 直接消失
      this.touchEnd = false
      setTimeout(() => { this.touchEnd = true })
      this.slideLength = 0
      // tips 闪现
      this.tipsAni = 45
      setTimeout(() => {
        this.tipsAni = 0
        this.refreshing = false
      }, 1200)
    }
  },
  mounted() {
    // console.log(this.up)

    // 初始化自动加载
    if (this.up.hasOwnProperty('callback') && this.up.auto) this.call()

    this.$refs.scroll.addEventListener('scroll', ev => {
      // 是否是向上滑动
      if (ev.target.scrollTop > this.scrollY) {
        this.isUp = true
      } else {
        this.isUp = false
      }
      this.scrollY = ev.target.scrollTop
      // 滑动距离
      if (this.up.hasOwnProperty('onScroll')) this.up.onScroll(ev.target.scrollTop, this.isUp)
      // 滑动触底
      if (this.up.hasOwnProperty('callback')) {
        if ((ev.target.scrollTop + this.$refs.scroll.offsetHeight + 10) >= ev.target.scrollHeight) this.call()
      }
      // 滑动触顶
      if (ev.target.scrollTop === 0) {
        this.isTop = true
      } else {
        this.isTop = false
      }
    })

    // 滑动触顶继续下拉监听
    this.$refs.scroll.addEventListener('touchstart', ev => {
      if (this.refreshing) return
      this.touchEnd = false
      this.refreshReady = false
      this.touchStart = ev.touches[0].clientY
    })
    this.$refs.scroll.addEventListener('touchmove', ev => {
      if (this.refreshing) return
      // 没到顶不执行下拉
      if (!this.isTop && !this.startBlock) {
        this.touchStart = ev.touches[0].clientY
      } else {
        this.startBlock = true
      }
      // 实际滑动距离
      let realSlideLength = ev.touches[0].clientY - this.touchStart
      // 如果滑动位移归 0 则释放滑动
      if (realSlideLength <= 0) {
        this.scrollBlock = false
        if (this.startBlock) {
          this.$refs.scroll.scrollTo(0, Math.abs(realSlideLength))
        }
      } else {
        this.scrollBlock = true
      }
      // 实时赋值
      if (realSlideLength <= 130) {
        this.slideLength = realSlideLength
        this.refreshReady = false
      } else {
        this.refreshReady = true
      }
    })
    this.$refs.scroll.addEventListener('touchend', ev => {
      if (this.refreshing) return
      this.touchEnd = true
      this.startBlock = false
      this.scrollBlock = false
      if (!this.refreshReady) {
        this.slideLength = 0
        return
      }
      this.slideLength = 60
      this.refreshing = true
      this.up.downRefresh.callback()
    })
  },
  methods: {
    // init
    init() {
      this.call()
    },

    // 上拉触底成功
    upEndSucc(data) {
      this.firstIn = false
      this.upEnd = true
      this.loading = false
      this.more = data.more
      this.empty = data.empty
    },

    // 上拉触底失败
    upEndErr() {
      this.upEnd = true
      this.netErr = true
      this.loading = false
    },

    // 上拉加载回调
    call() {
      if ((this.upEnd && this.more) || this.netErr) {
        this.upEnd = false
        this.loading = true
        this.netErr = false
        this.up.callback()
      }
    }
  }
}
</script>

<style lang="scss">
.scroll {
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  .pull-refresh {
    width: 100%;
    position: fixed;
    top: -80px;
    z-index: 2;
    >div {
      width: 70px;
      height: 70px;
      margin: 0 auto;
      border-radius: 50%;
      background: #fff;
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.4);
      .static-loading {
        position: relative;
        .in {
          position: absolute;
          top: 0;
          left: 0;
        }
      }
    }
  }
  .refresh-ani {
    transition: transform .2s linear;
  }
  .tips {
    width: 100%;
    text-align: center;
    position: fixed;
    top: -55px;
    z-index: 2;
    transition: transform .4s linear;
    span {
      color: #fff;
      display: inline-block;
      line-height: 55px;
      font-size: 22px;
      padding: 0 25px;
      border-radius: 50PX;
      background: rgba(0, 0, 0, 0.6);
    }
  }
}
</style>