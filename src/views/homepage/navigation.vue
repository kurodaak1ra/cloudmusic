<template>
  <div class="navigation">
    <div class="menu">
      <span @click="SET_WINDOWS(['left', true])">&#xe678;</span>
      <span v-if="false" class="msg-count">4</span>
    </div>
    <div class="to">
      <a href="javascript:void(0)" :class="{ 'active': index === 0 }" @click="SET_GLOBAL(['navIndex', 0])">我的</a>
      <a href="javascript:void(0)" :class="{ 'active': index === 1 }" @click="SET_GLOBAL(['navIndex', 1])">发现</a>
      <a href="javascript:void(0)" :class="{ 'active': index === 2 }">云村</a>
      <a href="javascript:void(0)" :class="{ 'active': index === 3 }">视频</a>
    </div>
    <router-link to="/search" class="search">&#xe677;</router-link>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { getGLOBAL } from '../../utils/store'

export default {
  name: 'navigation',
  data() {
    return {
      getGLOBAL,
      index: 1
    }
  },
  watch: {
    '$store.state.GLOBAL.navIndex'(newer, older) {
      this.index = newer
    }
  },
  methods: {
    ...mapMutations([
      'SET_GLOBAL',
      'SET_WINDOWS'
    ])
  }
}
</script>

<style lang="scss">
.navigation {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  font-size: 30px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  background: #fff;
  .menu {
    position: relative;
    font-size: 35px;
    .msg-count {
      color: #fff;
      width: 28px;
      height: 28px;
      position: absolute;
      top: -15px;
      right: -28px;
      border-radius: 50%;
      background: #ff3a3a;
      text-align: center;
      line-height: 28px;
      font-size: 15px;
    }
  }
  .to {
    a {
      color: #7f7f7f;
      opacity: .6;
      margin: 0 20px;
      font-size: 25px;
    }
    .active {
      color: #343434;
      opacity: 1;
      font-size: 30px;
      font-weight: bold;
    }
  }
  .search {
    color: #333;
    font-size: 35px;
  }
}
</style>
