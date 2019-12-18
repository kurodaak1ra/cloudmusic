<template>
  <swiper ref="mySwiper" class="homepage-page web-page" :options="swiperOption()">
    <swiper-slide>
      <mine></mine>
    </swiper-slide>
    <swiper-slide>
      <found></found>
    </swiper-slide>
  </swiper>
</template>

<script>
import mine from './mine'
import found from './found'
import { mapMutations } from 'vuex'
import { getGLOBAL } from '../../utils/store'

export default {
  name: 'homepage',
  components: { mine, found },
  data() {
    return {
      getGLOBAL,
      index: 1
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  watch: {
    '$store.state.GLOBAL.navIndex'(newer, older) {
      this.index = newer
    },
    index(newer, older) {
      this.swiper.slideTo(newer, 300)
    }
  },
  mounted() {
    this.swiper.slideTo(1, 0)
  },
  methods: {
    ...mapMutations([
      'SET_GLOBAL'
    ]),

    swiperOption() {
      let _this = this
      return {
        on: {
          slideChangeTransitionEnd: function() {
            _this.SET_GLOBAL(['navIndex', this.activeIndex])
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
.homepage-page {
  padding-top: 90px;
}
</style>