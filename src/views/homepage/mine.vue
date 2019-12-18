<template>
  <scroll ref="scroll" class="mine-page web-page" :up="getScrollUp()">
    <div class="nav no-scroll-bar">
      <ul>
        <li v-for="(i, index) in top" :key="index">
          <div></div>
          <p>{{i.text}}</p>
        </li>
      </ul>
    </div>
    <ul class="list">
      <li>
        <span>&#xe65c;</span>
        <p>我的电台<span>（{{djRadioCount}}）</span></p>
      </li>
      <li @click="$router.push({ path: '/my-collect' })">
        <span>&#xe65d;</span>
        <p>我的收藏<span>（{{subCount}}）</span></p>
      </li>
    </ul>
    <div class="create-list">
      <div class="title">
        <div class="left" @click="craeteToggle()">
          <span v-html="craeteToggleFlag ? '&#xe65f;&nbsp;' : '&#xe624;&nbsp;'">&#xe65f;&nbsp;</span>
          <span>创建的歌单&nbsp;</span>
          <span>({{createCount}})</span>
        </div>
        <div class="right">
          <span @click="SET_WINDOWS(['simple', 'creat-playlist'])">&#xe666;</span>
          <span @click="winShow('title-create', '创建的歌单')">&#xe61f;</span>
        </div>
      </div>
      <ul ref="createInner" class="inner">
        <li v-for="(i, index) in create" :key="index" @click="goPlaylist(i.id, /喜欢的音乐/i.test(i.name) ? i.name.replace(getGLOBAL('userInfo').nickname, '我') : i.name)">
          <div class="cover" :style="{ backgroundImage: `url(${i.coverImgUrl}?imageView=1&thumbnail=90x0)` }"></div>
          <div class="info">
            <div>
              <p>{{/喜欢的音乐/i.test(i.name) ? i.name.replace(getGLOBAL('userInfo').nickname, '我') : i.name}}</p>
              <p>{{i.trackCount}}首</p>
            </div>
            <span v-if="index === 0" class="dokidoki" @click.stop="">心动模式</span>
            <span v-else @click.stop="winShow('list', i.name, i.uid, i.id)">&#xe61f;</span>
          </div>
        </li>
      </ul>
    </div>
    <div v-if="getGLOBAL('isLogin')" class="collect-list">
      <div class="title">
        <div class="left" @click="collectToggle()">
          <span v-html="collectToggleFlag ? '&#xe65f;&nbsp;' : '&#xe624;&nbsp;'"></span>
          <span>收藏的歌单&nbsp;</span>
          <span>({{collectCount}})</span>
        </div>
        <div class="right">
          <span @click="winShow('title-collect', '收藏的歌单')">&#xe61f;</span>
        </div>
      </div>
      <ul ref="collectInner" class="inner">
        <li v-for="(i, index) in collect" :key="index" @click="goPlaylist(i.id, i.name)">
          <div class="cover" :style="{ backgroundImage: `url(${i.coverImgUrl}?imageView=1&thumbnail=90x0)` }"></div>
          <div class="info">
            <div>
              <p>{{i.name}}</p>
              <p>{{i.trackCount}}首</p>
            </div>
            <span @click.stop="winShow('list', i.name, i.uid, i.id)">&#xe61f;</span>
          </div>
        </li>
      </ul>
    </div>
    <!-- 弹窗 -->
    <ul class="win" :style="{ transform: win ? 'translate3d(0, 0, 0)' : 'translate3d(0, 100%, 0)' }">
      <li class="title one-line-ellipsis">{{winTitle}}</li>
      <li v-if="winType === 'title-create'">
        <span>&#xe666;</span>
        <span>创建新歌单</span>
      </li>
      <li v-if="winType === 'title-create' || winType === 'title-collect'">
        <span>&#xe666;</span>
        <span>歌单管理</span>
      </li>
      <li v-if="winType === 'title-create'">
        <span>&#xe666;</span>
        <span>截图导入歌单</span>
      </li>
      <li v-if="winType === 'title-create'">
        <span>&#xe666;</span>
        <span>恢复歌单</span>
      </li>
      <!--  -->
      <li v-if="winType === 'list'">
        <span>&#xe673;</span>
        <span>下载</span>
      </li>
      <li v-if="winType === 'list'">
        <span>&#xe674;</span>
        <span>分享</span>
      </li>
      <li v-if="winType === 'list' && winUid === getGLOBAL('userInfo').uid" @click="goEdit()">
        <span>&#xe666;</span>
        <span>编辑歌单信息</span>
      </li>
      <li v-if="winType === 'list'">
        <span>&#xe625;</span>
        <span>删除</span>
      </li>
    </ul>
  </scroll>
</template>

<script>
import scroll from '../plugins/scroll'
import { mapMutations } from 'vuex'
import { getGLOBAL } from '../../utils/store'
import { batchApi } from '../../utils/api'
import { goPlaylist } from '../../utils/function'

export default {
  name: 'mine',
  components: { scroll },
  data() {
    return {
      // 方法
      getGLOBAL,
      goPlaylist,
      // 数据
      offset: 0,
      create: [],
      createCount: 0,
      collect: [],
      collectCount: 0,
      subCount: 0,
      djRadioCount: 0,
      more: false,
      craeteToggleFlag: true,
      collectToggleFlag: true,
      createOffsetHeight: 0,
      collectOffsetHeight: 0,
      top: [
        { url: '', text: '测试' },
        { url: '', text: '测试' },
        { url: '', text: '测试' },
        { url: '', text: '测试' },
        { url: '', text: '测试' },
        { url: '', text: '测试' }
      ],
      // 弹窗
      win: false,
      winUid: null,
      winPlid: null,
      winType: '',
      winTitle: ''
    }
  },
  watch: {
    '$store.state.windows.mask'(newer, older) {
      if (!newer) this.win = newer
    },
    '$store.state.GLOBAL.navIndex'(newer, older) {
      if (getGLOBAL('isLogin')) {
        if (newer === 0 && (this.create.length === 0 || this.collect.length === 0)) this.$refs.scroll.init()
      }
    }
  },
  methods: {
    ...mapMutations([
      'SET_WINDOWS',
      'SET_PAGE_DATA'
    ]),

    // scroll
    getScrollUp() {
      return {
        auto: false,
        callback: () => { this.init() }
      }
    },

    // 获取歌单
    init() {
      let data = ['subcount-v1', 'user-playlist']
      batchApi({
        batch: data.toString(),
        limit: 1000,
        offset: this.offset,
        uid: getGLOBAL('userInfo').uid
      }).then(succ => {
        console.log('获取用户歌单、收藏量（success）：', succ)
        let tempCreate = []
        let tempCollect = []
        let list = succ['/api/user/playlist'].playlist
        this.offset += 1000
        for (let i = 0; i < list.length; i++) {
          if (list[i].creator.userId === getGLOBAL('userInfo').uid) {
            tempCreate.push({
              coverImgUrl: list[i].coverImgUrl,
              uid: list[i].creator.userId,
              id: list[i].id,
              name: list[i].name,
              trackCount: list[i].trackCount
            })
          } else {
            tempCollect.push({
              coverImgUrl: list[i].coverImgUrl,
              uid: list[i].creator.userId,
              id: list[i].id,
              name: list[i].name,
              trackCount: list[i].trackCount
            })
          }
        }
        this.create = tempCreate
        this.createCount = succ['/api/subcount/v1'].createdPlaylistCount
        this.collect = tempCollect
        this.collectCount = succ['/api/subcount/v1'].subPlaylistCount
        this.subCount = succ['/api/subcount/v1'].subCount
        this.djRadioCount = succ['/api/subcount/v1'].djRadioCount
        this.more = succ['/api/user/playlist'].more
        // 加载结束
        this.$refs.scroll.upEndSucc({ more: false })
      }).catch(err => {
        console.warn('获取用户歌单、收藏量（error）：', err)
        this.$refs.scroll.upEndErr()
      })
    },

    // toggle 动画
    craeteToggle() {
      if (this.craeteToggleFlag) {
        this.createOffsetHeight = this.$refs.createInner.offsetHeight
        this.$refs.createInner.style.height = this.createOffsetHeight + 'px'
        setTimeout(() => {
          this.$refs.createInner.style.height = 0
        }, 0)
      } else {
        this.$refs.createInner.style.height = this.createOffsetHeight + 'px'
      }
      this.craeteToggleFlag = !this.craeteToggleFlag
    },

    // toggle 动画
    collectToggle() {
      if (this.collectToggleFlag) {
        this.collectOffsetHeight = this.$refs.collectInner.offsetHeight
        this.$refs.collectInner.style.height = this.collectOffsetHeight + 'px'
        setTimeout(() => {
          this.$refs.collectInner.style.height = 0
        }, 0)
      } else {
        this.$refs.collectInner.style.height = this.collectOffsetHeight + 'px'
      }
      this.collectToggleFlag = !this.collectToggleFlag
    },

    // 弹窗
    winShow(type, title, uid, plid) {
      this.$mask()
      this.win = true
      this.winUid = uid
      this.winPlid = plid
      this.winType = type
      this.winTitle = title
    },

    // 编辑歌单
    goEdit() {
      this.$rmask()
      this.SET_PAGE_DATA(['playlistEdit', 'id', this.winPlid])
      this.$router.push({ path: '/playlist-edit' })
    }
  }
}
</script>

<style lang="scss">
.mine-page {
  overflow: auto;
  .nav {
    height: 180px;
    display: flex;
    align-items: center;
    overflow-x: auto;
    overflow-y: hidden;
    border-bottom: 1.5px solid #f5f5f5;
    ul {
      white-space: nowrap;
      li {
        color: #959595;
        display: inline-block;
        width: 135px;
        text-align: center;
        div {
          width: 70px;
          height: 70px;
          margin: 0 auto;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
        }
        p {
          white-space: nowrap;
          line-height: 2em;
        }
      }
    }
  }
  .list {
    border-bottom: 15px solid #f5f5f5;
    li {
      height: 90px;
      display: flex;
      align-items: center;
      >span {
        padding: 0 45px;
        font-size: 40px;
      }
      p {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        border-bottom: 1.5px solid #f5f5f5;
        span {
          color: rgba(0, 0, 0, 0.4);
        }
      }
    }
    li:last-child {
      p {
        border: none;
      }
    }
  }
  .create-list, .collect-list {
    .title {
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 28px;
      .left {
        width: 100%;
        span:first-child {
          color: #464646;
        }
        span:nth-child(2) {
          font-size: 30px;
        }
        span:last-child {
          color: rgba(0, 0, 0, 0.4);
          font-size: 23px;
        }
      }
      .right {
        font-size: 30px;
        white-space: nowrap;
        span {
          margin-left: 25px;
        }
      }
    }
    .inner {
      overflow: hidden;
      transition: height .5s;
      li {
        display: flex;
        align-items: center;
        padding: 10px 0 10px 28px;
        .cover {
          width: 90px;
          height: 90px;
          flex-shrink: 0;
          border-radius: 8px;
          background: no-repeat center center / cover;
        }
        .info {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-left: 20px;
          padding-right: 28px;
          span {
            color: #b3b3b3;
            font-size: 30px;
          }
          .dokidoki {
            color: #333;
            font-size: 22px;
            padding: 0 1em;
            line-height: 2em;
            border-radius: 50PX;
            border: 1.5px solid #f5f5f5;
          }
        }
      }
    }
  }
  .win {
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
    background: #fff;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 11;
    transition: transform .2s;
    .title {
      color: #5a5a5a;
      display: block;
      font-size: 22px;
      border-bottom: 1.5px solid #f5f5f5;
      padding-right: 28px;
    }
    li {
      line-height: 85px;
      padding-left: 28px;
      display: flex;
      span:first-child {
        font-size: 40px;
        margin-right: 20px;
      }
      span:last-child {
        display: inline-block;
        width: 100%;
        height: 100%;
        border-bottom: 1.5px solid #f5f5f5;
      }
    }
  }
}
</style>
