<template>
  <div class="artist-details web-page">
    <div class="nav">
      <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
      <div>歌手介绍</div>
    </div>
    <div class="main">
      <div>
        <p class="title">{{getGLOBAL('artist').name}}简介</p>
        <p v-for="(i, index) in briefDesc.split('\n')" :key="index" class="info">{{i === '' ? '&nbsp;' : i}}</p>
      </div>
      <div v-for="(i, index) in introduction" :key="index">
        <p class="title">{{i.ti}}简介</p>
        <p v-for="(j, index) in i.txt.split('\n')" :key="index" class="info">{{j === '' ? '&nbsp;' : j}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { artistIntroductionApi } from '../utils/api'
import { getGLOBAL } from '../utils/store'

export default {
  name: 'artist-details',
  data() {
    return {
      // 方法
      getGLOBAL,
      // 数据
      briefDesc: '',
      introduction: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      artistIntroductionApi({
        id: getGLOBAL('artist').id
      }).then(succ => {
        console.log('获取艺术家详细信息（success）：', succ)
        this.briefDesc = succ.briefDesc
        this.introduction = succ.introduction
      }).catch(err => {
        console.warn('获取艺术家详细信息（error）：', err)
      })
    }
  }
}
</script>

<style lang="scss">
.artist-details {
  .nav {
    height: 90px;
    display: flex;
    align-items: center;
    padding: 0 28px;
    font-size: 30px;
    position: absolute;
    top: 0;
    left:0;
    right: 0;
    z-index: 2;
    .back-icon {
      font-size: 35px;
      margin-right: 30px;
    }
  }
  .main {
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding: 0 23px 1.5em;
    .title {
      font-size: 30px;
      line-height: 1em;
      display: flex;
      padding: 40px 0 25px
    }
    .title::before {
      display: block;
      content: "";
      width: 6px;
      height: 1em;
      margin-right: 10px;
      border-radius: 6px;
      background: #ff3a3a;
    }
    .info {
      color: #666;
      font-size: 23px;
      text-align: justify;
    }
  }
}
</style>
