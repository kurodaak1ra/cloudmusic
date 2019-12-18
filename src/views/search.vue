<template>
  <div class="search-page web-page">
    <div class="nav">
      <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
      <div>
        <input ref="input" v-model="keyWords" type="text" :placeholder="placeholder" maxlength="20" autofocus="autofocus" @keyup.enter="goSearch" @input="keywordsInput" @focus="keywordsFocus">
        <span v-if="keyWords !== ''" class="clear" @click="clearFun()">&#xe62b;</span>
      </div>
      <span class="artist" @click="goArtistListPage()">&#xe62e;</span>
    </div>
    <!-- 搜索建议 -->
    <ul v-if="suggestWin" class="suggest-float-win">
      <li @click="goSearch(keyWords)">搜索 “{{keyWords}}”</li>
      <li v-for="(i, index) in suggest" :key="index" @click="goSearch(i.keyword)">
        <span>&#xe677; &nbsp;</span>
        <span>{{i.keyword}}</span>
      </li>
    </ul>
    <scroll ref="scroll" class="content" :up="getScrollUp()">
      <!-- 历史记录 -->
      <div v-if="getGLOBAL('search').history.length !== 0" class="search-history">
        <div>
          <p>历史记录</p>
          <span @click="SET_WINDOWS(['simple', 'search-history-clear-confirm'])">&#xe625;</span>
        </div>
        <ul class="no-scroll-bar">
          <li v-for="(i, index) in getGLOBAL('search').history" :key="index" @click="goSearch(i)">{{i}}</li>
        </ul>
      </div>
      <!-- 热搜榜 -->
      <ul class="hot-search">
        <p v-if="hot.legth !== 0">热搜榜</p>
        <li v-for="(i, index) in hot" :key="index" @click="goSearch(i.searchWord)">
          <span :style="{ color: index <= 2 ? '#ff3a3a' : '#999999' }">{{index + 1}}</span>
          <div>
            <div>
              <span :style="{ fontWeight: index <= 2 ? 'bold' : 'unset' }">{{i.searchWord}}</span>&nbsp;&nbsp;
              <span>{{i.score}}</span>&nbsp;&nbsp;
              <img v-if="i.iconUrl !== null" :src="i.iconUrl" alt="">
            </div>
            <p>{{i.content}}</p>
          </div>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script>
import scroll from './plugins/scroll'
import { mapMutations } from 'vuex'
import { getGLOBAL } from '../utils/store'
import { searchDefaultApi, searchHotDetailApi, searchSuggestApi } from '../utils/api'

export default {
  name: 'search',
  components: { scroll },
  data() {
    return {
      // 方法
      getGLOBAL,
      // 数据
      default: '',
      placeholder: '音乐、视频、歌词、电台',
      hot: [],
      suggest: [],
      suggestWin: false,
      keyWords: '',
    }
  },
  mounted() {
    // @blur 报错，没法用，曲线救国
    this.$refs.input.addEventListener('blur', () => {
      setTimeout(() => { this.suggestWin = false }) // 防止一点击搜索建议直接隐藏导致没点到
    })

    // 安卓关闭键盘自动失去焦点
    // if (/iPhone|iPad|iPod|Mac/i.test(window.navigator.userAgent)) return
    // const originHeight = document.documentElement.clientHeight || document.body.clientHeight
    // window.addEventListener('resize', () => {
    //   const resizeHeight = document.documentElement.clientHeight || document.body.clientHeight
    //   if (resizeHeight === originHeight) this.$refs.input.blur()
    // }, false)
  },
  methods: {
    ...mapMutations([
      'SET_WINDOWS',
      'SET_PAGE_DATA'
    ]),

    // scroll
    getScrollUp() {
      return {
        auto: true,
        callback: () => {
          this.searchHot()
          this.searchDefault()
        }
      }
    },

    // 获取默认搜索关键词
    searchDefault() {
      searchDefaultApi().then(succ => {
        console.log('默认搜索关键词（succees）：', succ)
        this.default = succ.data.realkeyword
        this.placeholder = succ.data.showKeyword
      }).catch(err => {
        console.warn('默认搜索关键词（error）：', err)
      })
    },

    // 新版热搜
    searchHot() {
      searchHotDetailApi().then(succ => {
        console.log('热搜榜（success）：', succ)
        this.hot = succ.data
        this.$refs.scroll.upEndSucc({ more: false })
      }).catch(err => {
        console.warn('热搜榜（error）：', err)
        this.$refs.scroll.upEndErr()
      })
    },

    clearFun() {
      this.tempKeyWords = ''
      this.suggestWin = false
      this.$refs.input.focus()
    },

    // 输入
    keywordsInput(ev) {
      this.keyWords = ev.target.value
      if (this.keyWords === '') {
        this.suggestWin = false
        return
      }
      this.suggestWin = true
      searchSuggestApi({
        type: getGLOBAL('search').type === 0 ? 1018 : getGLOBAL('search').type,
        limit: 10,
        keywords: ev.target.value
      }).then(succ => {
        console.log('搜索建议（success）：', succ)
        this.suggest = succ.result.allMatch
      }).catch(err => {
        console.warn('搜索建议（error）：', err)
      })
    },

    // 获取焦点
    keywordsFocus(ev) {
      if (this.keyWords !== '') this.suggestWin = true
    },

    // 搜索
    goSearch(keywords) {
      let tempKeyWords = ''
      if (typeof keywords === 'object') {
        if (keywords.target.value === '') {
          tempKeyWords = this.default
        } else {
          tempKeyWords = keywords.target.value
        }
      } else {
        tempKeyWords = keywords
      }
      this.SET_PAGE_DATA(['search', 'keywords', tempKeyWords])
      // 保留历史记录
      let tempHistory = getGLOBAL('search').history
      let index = tempHistory.indexOf(tempKeyWords)
      if (index !== -1) tempHistory.splice(index, 1)
      tempHistory.unshift(tempKeyWords)
      this.SET_PAGE_DATA(['search', 'history', tempHistory])
      this.$router.push({ path: '/search-result' })
    },

    // 跳艺术家列表页
    goArtistListPage() {
      this.$toast('还没做，有空再写')
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'found') this.SET_PAGE_DATA(['search', 'type', 1018])
    next()
  }
}
</script>

<style lang="scss">
.search-page {
  .nav {
    height: 90px;
    padding: 0 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .back-icon {
      font-size: 35px;
      margin-right: 30px;
    }
    div {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1.5px solid #808080;
      input {
        font-size: 30px;
      }
      input::-webkit-input-placeholder {
        color: #c8c8c8;
      }
      input:-moz-placeholder {
        color: #c8c8c8;
      }
      input::-moz-placeholder {
        color: #c8c8c8;
      }
      input:-ms-input-placeholder {
        color: #c8c8c8;
      }
      span {
        font-size: 30px;
        margin: 0 15px 0 30px;
      }
    }
    .artist {
      font-size: 45px;
      margin-left: 40px;
    }
  }
  // 搜索建议
  .suggest-float-win {
    width: 610px;
    margin: 5px 0 0 28px;
    background: #fff;
    position: relative;
    z-index: 1;
    box-shadow: 0px 0px 10px 0px #888888;
    li {
      color: #707070;
      padding: 0 25px;
      line-height: 85px;
      border-top: 1px solid #f5f5f5;
      display: flex;
      align-items: center;
      span:first-child {
        font-size: 30px;
      }
    }
    li:first-child {
      color: #537fb0;
      border: none;
    }
  }
  .content {
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    padding: 0 28px;
    // 历史记录
    .search-history {
      position: relative;
      div {
        margin-top: 60px;
        display: flex;
        justify-content: space-between;
        >p {
          font-size: 23px;
          font-weight: bold;
        }
        span {
          color: #999;
          font-size: 30px;
        }
      }
      ul {
        overflow: auto;
        white-space: nowrap;
        margin-top: 25px;
        li {
          height: 50px;
          line-height: 50px;
          border-radius: 50PX;
          margin-right: 20px;
          padding: 0 20px;
          background: rgba(0, 0, 0, 0.08);
          display: inline-block;
        }
        li:last-child {
          margin: 0;
        }
      }
    }
    .search-history::before {
      content: '';
      width: 30px;
      height: 50px;
      position: absolute;
      left: 0;
      bottom: 0;
      background: linear-gradient(to right, rgb(255, 255, 255), transparent);
    }
    .search-history::after {
      content: '';
      width: 30px;
      height: 50px;
      position: absolute;
      right: 0;
      bottom: 0;
      background: linear-gradient(to left, rgb(255, 255, 255), transparent);
    }
    // 热搜
    .hot-search {
      >p {
        font-size: 23px;
        font-weight: bold;
        margin-top: 60px;
      }
      li {
        display: flex;
        align-items: center;
        padding: 23px 0;
        >span {
          width: 1.5em;
          text-align: center;
        }
        >div {
          margin-left: 35px;
          div {
            span:first-child {
              font-weight: bold;
            }
            span:nth-child(2) {
              color: #999999;
              font-size: 20px;
            }
            img {
              display: inline-block;
              width: unset;
              height: 18px;
            }
          }
          >p {
            color: #999999;
            font-size: 20px;
            margin-top: 10px;
          }
        }
      }
    }
  }
}
</style>
