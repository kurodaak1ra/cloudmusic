<template>
  <div class="update-page web-page">
    <div class="nav">
      <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
      <span>更新说明</span>
    </div>
    <div class="list">
      <template v-for="(i, k) in list">
        <div :key="k + 'A'" class="update-title">
          <svg viewBox="0 0 14 16" version="1.1" width="14" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M10.86 7c-.45-1.72-2-3-3.86-3-1.86 0-3.41 1.28-3.86 3H0v2h3.14c.45 1.72 2 3 3.86 3 1.86 0 3.41-1.28 3.86-3H14V7h-3.14zM7 10.2c-1.22 0-2.2-.98-2.2-2.2 0-1.22.98-2.2 2.2-2.2 1.22 0 2.2.98 2.2 2.2 0 1.22-.98 2.2-2.2 2.2z"></path></svg>{{i.u_time}}
        </div>
        <ul :key="k + 'B'">
          <li v-for="(j, index) in i.u_text.split('\n')" :key="index">{{index + 1}}. {{j}}</li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
import { updateLogApi } from '../../utils/api'

export default {
  name: 'update-page',
  data() {
    return {
      list: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      updateLogApi().then(succ => {
        console.log('获取更新日志（success）：' + succ)
        this.list = succ
      }).catch(err => {
        console.warn('获取更新日志（error）：' + err)
      })
    }
  }
}
</script>

<style lang="scss">
.update-page {
  overflow: auto;
  .nav {
    height: 90px;
    font-size: 30px;
    line-height: 90px;
    padding: 0 28px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    background: #fff;
    .back-icon {
      font-size: 35px;
      margin-right: 30px;
    }
  }
  .list {
    position: relative;
    padding: 110px 20px 20px 80px;
    .update-title {
      color: #586069;
      line-height: 1em;
      margin-top: 40px;
      margin-left: -50px;
      font-weight: bold;
      font-size: 22px;
      svg {
        color: #c6cbd1;
        background: #fff;
        margin-right: 20px;
        vertical-align: middle;
        display: inline-block;
        fill: currentColor;
      }
      svg:not(:root) {
        overflow: hidden;
      }
    }
    >div:first-child {
      margin-top: 0px;
    }
    ul {
      li {
        text-align: justify;
        line-height: 1.75em;
      }
    }
  }
  .list::before {
    width: 3px;
    content: "";
    position: absolute;
    top: 0;
    left: 42.5px;
    bottom: 0;
    z-index: -1;
    display: block;
    background-color: #eff1f3;
  }
}
</style>
