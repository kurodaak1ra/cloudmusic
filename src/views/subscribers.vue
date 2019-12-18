<template>
  <div class="subscribers-page web-page">
    <div class="nav">
      <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
      <span class="text">收藏者</span>
    </div>
    <div class="content">
      <scroll ref="scroll" :up="getScrollUp()">
        <ul class="in">
          <li v-for="(i, index) in data" :key="index" @click="SET_PAGE_DATA(['user', 'id', i.userId]);$router.push({ path: '/user' })">
            <div class="avatar" :style="{ backgroundImage: `url(${i.avatarUrl}?imageView=1&thumbnail=50x0)` }"></div>
            <div class="info">
              <div>
                <span class="nickname">{{i.nickname}}</span>
                <span v-if="i.gender === 1" class="male">&#xe665;</span>
                <span v-if="i.gender === 2" class="female">&#xe664;</span>
              </div>
              <span v-if="i.signature !== ''" class="signature one-line-ellipsis">{{i.signature}}</span>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
  </div>
</template>

<script>
import scroll from './plugins/scroll'
import { mapMutations } from 'vuex'
import { getGLOBAL } from '../utils/store'
import { playlistSubscribersApi } from '../utils/api'

export default {
  name: 'subscribers',
  components: { scroll },
  data() {
    return {
      // 方法
      getGLOBAL,
      // 数据
      data: [],
      offset: 0
    }
  },
  methods: {
    ...mapMutations([
      'SET_PAGE_DATA'
    ]),

    // scroll
    getScrollUp() {
      return {
        auto: true,
        callback: () => { this.init() }
      }
    },

    // 初始化
    init() {
      playlistSubscribersApi({
        id: getGLOBAL('playlist').id,
        limit: 20,
        offset: this.offset
      }).then(succ => {
        console.log('获取订阅用户（success）：', succ)
        this.data = this.data.concat(succ.subscribers)
        this.offset += 20
        this.$refs.scroll.upEndSucc({ more: succ.more })
      }).catch(err => {
        console.warn('获取订阅用户（error）：', err)
        this.$refs.scroll.upEndErr()
      })
    }
  }
}
</script>

<style lang="scss">
.subscribers-page {
  .nav {
    height: 90px;
    display: flex;
    align-items: center;
    font-size: 30px;
    padding: 0 28px;
    .back-icon {
      font-size: 35px;
      margin-right: 30px;
    }
  }
  .content {
    width: 100%;
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 0;
    .in {
      li {
        height: 125px;
        display: flex;
        align-items: center;
        padding: 0 28px;
        box-sizing: content-box;
        .avatar {
          width: 95px;
          height: 95px;
          border-radius: 50%;
          margin-right: 15px;
          flex-shrink: 0;
          background: no-repeat center center / cover;
        }
        .info {
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          line-height: 1em;
          overflow: hidden;
          div {
            .nickname {
              margin-right: 10px;
            }
            .male {
              color: #3da8dd;
            }
            .female {
              color: #ff80b3;
            }
          }
          .signature {
            color: #858585;
            font-size: 20px;
            margin-top: 20px;
          }
        }
      }
      li:last-child {
        div {
          border: none;
        }
      }
    }
  }
}
</style>
