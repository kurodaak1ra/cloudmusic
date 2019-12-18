<template>
  <div class="playlist-page web-page">
    <div class="nav" :style="{ backgroundImage: slideToTop ? `url(${coverUrlBlur})` : '' }">
      <div class="left">
        <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
        <div>
          <p class="title one-line-ellipsis">{{title}}</p>
          <p class="description one-line-ellipsis">{{getGLOBAL('playlist').copywriter}}</p>
        </div>
      </div>
      <div class="right">
        <span>&#xe677;</span>
        <span>&#xe61f;</span>
      </div>
    </div>
    <scroll ref="scroll" class="web-page" :up="getScrollUp()">
      <div class="title-area" :style="{ backgroundImage: `url(${coverUrlBlur})` }">
        <div ref="plInfo" class="playlist-info" :style="{ opacity: opacity }">
          <div class="left" @click="showDetailWin()">
            <div class="cover" :style="{ backgroundImage: `url(${data.coverUrlBlob})` }"></div>
            <span>&#xe667;{{formatCount(data.playCount)}}</span>
          </div>
          <div class="right">
            <div class="top">
              <p class="title two-line-ellipsis" @click="showDetailWin()">{{data.name}}</p>
              <div class="user" @click.stop="goUser(data.uid)">
                <div class="avatar" :style="{ backgroundImage: `url(${data.avatarUrl})` }"></div>
                <span>{{data.nickname}} &#xe624;</span>
              </div>
            </div>
            <div v-if="data.description === '' && !/喜欢的音乐/i.test(data.name) && data.uid === getGLOBAL('userInfo').uid" class="description" @click="goEdit()">编辑信息 &#xe624;</div>
            <div v-if="data.description !== '' && !/喜欢的音乐/i.test(data.name)" class="description" @click="showDetailWin()">
              <div v-if="data.description !== ''">
                <div>
                  <template v-for="(i, index) in data.description.split('\n')">
                    <p v-if="index < 2" :key="index" class="one-line-ellipsis">{{i === '' ? '&nbsp;' : i}}</p>
                  </template>
                </div>
                <span>&nbsp; &#xe624;</span>
              </div>
            </div>
          </div>
        </div>
        <div ref="btns" class="btns" :style="{ opacity: opacity }">
          <div @click="goComments(2, data.id, data.uid, data.name, data.nickname, data.coverUrlBlob)">
            <span>&#xe675;</span>
            <p>{{data.commentCount === 0 ? '评论' : data.commentCount}}</p>
          </div>
          <div ref="share" @click="share()">
            <span>&#xe674;</span>
            <p>{{data.shareCount === 0 ? '分享' : data.shareCount}}</p>
          </div>
          <div>
            <span>&#xe673;</span>
            <p>下载</p>
          </div>
          <div>
            <span>&#xe660;</span>
            <p>多选</p>
          </div>
        </div>
      </div>
      <!--中部导航 -->
      <div class="mid-nav" :style="{ backgroundImage: `url(${coverUrlBlur})` }">
        <div class="mid-nav-in">
          <template v-if="pageListData.length !== 0">
            <div class="left">
              <span>&#xe67e;</span>
              <span>全部播放</span>
              <span>(共{{data.trackCount}}首)</span>
            </div>
            <div v-if="data.subscribed && data.uid !== getGLOBAL('userInfo').uid" class="sub" @click="sub()">
              <span>&#xe627;</span>
              <span>{{data.subscribedCount}}</span>
            </div>
            <div v-if="!data.subscribed && data.uid !== getGLOBAL('userInfo').uid" class="unsub" @click="sub()">
              <span>&#xe666; 收藏 ({{formatCount(data.subscribedCount)}})</span>
            </div>
          </template>
        </div>
      </div>
      <!-- 歌曲列表 -->
      <ul class="main-list">
        <li v-for="(i, index) in pageListData" :key="index">
          <span :style="{ color: i.song.id === getGLOBAL('playingId') ? '#ff2e2e' : '#aeaeae' }" v-html="i.song.id === getGLOBAL('playingId') ? '&#xe688;' : (index + 1)"></span>
          <div>
            <div class="left" @click="goPlay(i.song.id, i.privilege.pl, musicList, musicListIds)">
              <p class="top one-line-ellipsis">
                <span :class="{ 'can': i.privilege.pl !== 0 }">{{i.song.name}}</span>
                <span v-if="i.alia !== ''">({{i.alia}})</span>
              </p>
              <p class="bottom">
                <span v-if="i.privilege.fee === 1" class="icon vip">&#xe68b;</span>
                <span v-if="/1152|1028|1088|1092/.test(i.privilege.flag)" class="icon listen">&#xe68d;</span>
                <span v-if="/64|68|1088|1092/.test(i.privilege.flag)" class="icon only">&#xe68c;</span>
                <span v-if="i.privilege.maxbr === 999000" class="icon sq">&#xe659;</span>
                <span class="one-line-ellipsis">{{i.artist}} - {{i.album.name}}</span>
              </p>
            </div>
            <div class="right">
              <span v-if="init.mv !== 0">&#xe609;</span>
              <span @click="SET_PAGE_DATA(['info', 'id', i.song.id]);SET_WINDOWS(['info', true])">&#xe61f;</span>
            </div>
          </div>
        </li>
      </ul>
      <div v-if="!hasMore && getGLOBAL('userInfo').uid !== data.crid" class="subscribers" @click.stop="$router.push({ path: '/subscribers' })">
        <ul>
          <li v-for="(i, index) in data.subscribers" :key="index" @click.stop="SET_PAGE_DATA(['user', 'id', i.userId]);$router.push({ path: '/user' })">
            <img :src="i.avatarUrl" alt="">
          </li>
        </ul>
        <p>{{data.subscribedCount}}人收藏</p>
      </div>
    </scroll>
    <div v-if="details" ref="details" class="details details-show" :style="{ backgroundImage: `url(${coverUrlBlur})` }" @click="detailsHide()">
      <span class="close">&#xe62b;</span>
      <div class="main">
        <div class="cover">
          <div :style="{ backgroundImage: `url(${data.coverUrlBlob})` }"></div>
        </div>
        <div class="info">
          <p class="name">{{data.name}}</p>
        </div>
        <div class="tags">
          <span>标签：</span>
          <span v-for="(i, index) in data.tags" :key="index" class="tag-list">{{i}}</span>
          <span v-if="data.tags.length === 0">无</span>
        </div>
        <div class="description">
          <p v-if="data.description === ''">暂无描述</p>
          <p v-for="(i, index) in data.description.split('\n')" :key="index">{{i === '' ? '&nbsp;' : i}}</p>
        </div>
      </div>
      <div class="operate">
        <span v-if="data.uid === getGLOBAL('userInfo').uid" @click.stop="goEdit()">编辑歌单</span>
        <a href="javascript:void(0)" @click.stop="downloadByBlob(data.coverUrl, `${data.name}_${data.coverImgId}`)">保存封面</a>
      </div>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import scroll from './plugins/scroll'
import { mapMutations } from 'vuex'
import { getGLOBAL } from '../utils/store'
import { playlistDetailApi, playlistSubscribeApi, songDetailApi } from '../utils/api'
import { imgToBlob, formatCount, projectMainCoreData, downloadByBlob } from '../utils/tools'
import { goComments, goPlay, goUser, goLogin } from '../utils/function'

export default {
  name: 'playlist',
  components: { scroll },
  data() {
    return {
      // 方法
      formatCount,
      getGLOBAL,
      downloadByBlob,
      goComments,
      goPlay,
      goUser,
      // 交互数据
      title: '歌单',
      opacity: 1,
      details: false,
      slideToTop: false,
      hasMore: true,
      listOffset: 0,
      // 请求的数据
      musicList: [],
      musicListIds: [],
      pageListData: [],
      coverUrlBlur: getGLOBAL('1px')['888888'],
      data: {
        // 公共字段
        id: null,
        name: getGLOBAL('playlist').name,
        uid: null,
        nickname: '',
        coverImgId: '',
        coverUrl: getGLOBAL('1px')['eeeeee'],
        coverUrlBlob: getGLOBAL('1px')['eeeeee'],
        shareCount: 0,
        subscribed: false,
        subscribedCount: 0,
        commentCount: 0,
        trackCount: 0,
        tags: [],
        description: '',
        // 歌单字段
        avatarUrl: getGLOBAL('1px')['ffffff'],
        crid: null,
        playCount: 0,
        trackIds: [],
        subscribers: []
      }
    }
  },
  mounted() {
    // 复制
    this.clipboard = new Clipboard(this.$refs.share, {
      text: () => {
        if (getGLOBAL('isLogin')) {
          return `分享${this.data.nickname}创建的歌单「${this.data.name === null ? getGLOBAL('playlist').name : this.data.name}」: http://music.163.com/playlist/${this.data.id}/${getGLOBAL('userInfo').uid}/?userid=${getGLOBAL('userInfo').uid} (来自@网易云音乐 by KA)`
        } else {
          return `分享${this.data.nickname}创建的歌单「${this.data.name === null ? getGLOBAL('playlist').name : this.data.name}」: http://music.163.com/playlist/${this.data.id} (来自@网易云音乐 by KA)`
        }
      }
    })
  },
  methods: {
    ...mapMutations([
      'SET_GLOBAL',
      'SET_WINDOWS',
      'SET_PAGE_DATA'
    ]),

    // scroll
    getScrollUp() {
      return {
        auto: true,
        callback: () => { this.pageLoad() },
        onScroll: (y, isUp) => {
          let targetHeight = this.$refs.plInfo.offsetHeight + this.$refs.btns.offsetHeight
          // 导航、透明度
          if (y >= targetHeight) {
            this.slideToTop = true
            this.opacity = 0
          } else {
            this.slideToTop = false
            this.opacity = 1 - y / targetHeight
          }
          // 上拉后标题
          if (y >= 70) {
            this.title = this.data.name
          } else {
            this.title = '歌单'
          }
        }
      }
    },

    // 判断选择触发
    pageLoad() {
      if (this.pageListData.length === 0) {
        this.init()
      } else {
        this.over1000()
      }
    },

    // 获取数据
    init() {
      playlistDetailApi({
        s: 5,
        id: getGLOBAL('playlist').id
      }).then(succ => {
        console.log('歌单详情（success）：', succ)
        // 公共字段
        this.data.id = succ.playlist.id
        this.data.name = /喜欢的音乐/i.test(succ.playlist.name) ? succ.playlist.name.replace(getGLOBAL('userInfo').nickname, '我') : succ.playlist.name
        this.data.uid = succ.playlist.creator.userId
        this.data.nickname = succ.playlist.creator.nickname
        this.data.coverImgId_str = succ.playlist.coverImgId_str
        this.data.coverUrl = succ.playlist.coverImgUrl
        this.data.shareCount = succ.playlist.shareCount
        this.data.subscribed = succ.playlist.subscribed
        this.data.subscribedCount = succ.playlist.subscribedCount
        this.data.commentCount = succ.playlist.commentCount
        this.data.trackCount = succ.playlist.trackCount
        this.data.tags = succ.playlist.tags
        this.data.description = (succ.playlist.description === null || succ.playlist.description === '') ? '' : succ.playlist.description
        // 歌单字段
        this.data.playCount = succ.playlist.playCount
        this.data.subscribers = succ.playlist.subscribers
        this.data.trackIds = succ.playlist.trackIds
        this.data.crid = succ.playlist.creator.userId
        // 生成歌曲列表
        this.mainMusicListDataSet(succ)
        // 是否还有更多
        if (this.data.trackCount === this.pageListData.length) this.hasMore = false
        // 歌曲偏移量
        this.listOffset = this.pageListData.length
        // 图片预热
        imgToBlob(succ.playlist.creator.avatarUrl + '?imageView=1&thumbnail=50x0', res => { this.data.avatarUrl = res })         // 头像
        imgToBlob(succ.playlist.coverImgUrl + '?imageView=1&thumbnail=225x0', res => { this.data.coverUrlBlob = res })          // cover
        imgToBlob(succ.playlist.coverImgUrl + '?imageView=1&thumbnail=225x0', blur => { this.coverUrlBlur = blur }, 100, -0.1)  // blur
        // 隐藏loading
        this.$refs.scroll.upEndSucc({ more: this.hasMore })
      }).catch(err => {
        console.warn('歌单详情（error）：', err)
        this.$refs.scroll.upEndErr()
      })
    },

    // 获取超过 1000 首
    over1000() {
      let tempList = []
      if (this.data.trackCount - this.listOffset >= 500) {
        for (let i = this.listOffset; i < this.listOffset + 500; i++) {
          tempList.push(this.data.trackIds[i].id)
        }
        if (this.data.trackCount === this.pageListData.length + tempList.length) this.hasMore = false
      } else if (this.data.trackCount - this.listOffset < 500 && this.data.trackCount - this.listOffset >= 0) {
        for (let i = this.listOffset; i < this.data.trackCount; i++) {
          tempList.push(this.data.trackIds[i].id)
        }
      } else {
        this.hasMore = false
        this.$refs.scroll.upEndSucc({ more: this.hasMore })
        return
      }
      // 发起请求
      songDetailApi({
        ids: tempList.toString()
      }).then(succ => {
        console.log('歌单分页请求（success）：', succ)
        this.listOffset += 500
        this.mainMusicListDataSet(succ, 'over1000')
        // 隐藏loading
        this.$refs.scroll.upEndSucc({ more: this.hasMore })
      }).catch(err => {
        console.warn('歌单分页请求（error）：', err)
        this.hasMore = true
        this.$refs.scroll.upEndErr()
      })
    },

    // 主歌曲数组数据
    mainMusicListDataSet(data, type) {
      let listData = type === 'over1000' ? data.songs : data.playlist.tracks
      for (let i = 0; i < listData.length; i++) {
        // 艺术家信息
        let tempArtist = []
        for (let j = 0; j < listData[i].ar.length; j++) {
          tempArtist.push(listData[i].ar[j].name)
        }
        // 当前页数据
        this.pageListData.push({
          song: {
            id: listData[i].id,
            name: listData[i].name
          },
          album: {
            name: listData[i].al.name
          },
          artist: tempArtist.toString().replace(/,/g, '/'),
          mv: listData[i].mv,
          alia: listData[i].alia.toString().replace(/,/g, '/'),
          privilege: {
            pl: data.privileges[i].pl,
            fee: data.privileges[i].fee,
            flag: data.privileges[i].flag,
            maxbr: data.privileges[i].maxbr
          }
        })
        // 无法播放歌曲不插入主数组 continue
        if (data.privileges[i].pl === 0) continue
        // 主数据
        this.musicListIds.push(listData[i].id)
        this.musicList.push(projectMainCoreData(
          listData[i],
          {
            id: this.data.id,
            name: `歌单「${this.data.name}」`,
            from: 'playlist'
          }
        ))
      }
    },

    // 收藏
    sub() {
      if (!getGLOBAL('isLogin')) goLogin('playlist', getGLOBAL('playlist').id)
      this.$loading()
      // 歌单
      playlistSubscribeApi({
        t: this.data.subscribed ? 0 : 1, // 1.收藏 0.取消
        id: getGLOBAL('playlist').id
      }).then(succ => {
        console.log('收藏歌单（success）：', succ)
        this.$rloading()
        if (this.data.subscribed) {
          this.$toast('已取消收藏')
          this.data.subscribed = false
        } else {
          this.$toast('收藏成功')
          this.data.subscribed = true
        }
      }).catch(err => {
        console.warn('收藏歌单（error）：', err)
        this.$rloading()
      })
    },

    // 编辑歌单详情
    goEdit() {
      this.SET_PAGE_DATA(['playlistEdit', 'id', this.data.id])
      this.$router.push({ path: '/playlist-edit' })
    },

    // 分享
    share() {
      this.clipboard.on('success', e => {
        this.$toast('分享链接复制成功')
      })
      this.clipboard.on('error', e => {
        this.$toast('浏览器不支持自动复制')
      })
    },

    // 详情页显示、隐藏
    showDetailWin() {
      if (!/喜欢的音乐/i.test(this.data.name)) this.details = true
      imgToBlob(this.data.coverUrl, res => { this.data.coverUrl = res })
    },
    detailsHide() {
      this.$refs.details.classList.remove('details-show')
      this.$refs.details.classList.add('details-hide')
      setTimeout(() => { this.details = false }, 190)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.details && to.path !== '/playlist-edit') {
      this.detailsHide()
      return next(false)
    }
    next()
  }
}
</script>

<style lang="scss">
.playlist-page {
  .nav {
    color: #fff;
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 28px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    background: no-repeat center bottom / cover;
    >div {
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 35px;
    }
    .left {
      width: 100%;
      margin-right: 20px;
      overflow: hidden;
      .back-icon {
        font-size: 35px;
        margin-right: 30px;
      }
      div {
        overflow: hidden;
        .title {
          font-size: 30px;
          line-height: 1em;
        }
        .description {
          font-size: 15px;
        }
      }
    }
    .right {
      flex-shrink: 0;
      span:last-child {
        margin-left: 30px;
      }
    }
  }
  .title-area {
    width: 100%;
    padding-top: 90px;
    overflow: hidden;
    transition: background-image .4s;
    background: no-repeat center bottom / cover;
    .playlist-info {
      padding: 35px 28px 40px;
      display: flex;
      justify-content: space-between;
      .left {
        width: 225px;
        position: relative;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        .cover {
          width: 225px;
          height: 225px;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          transition: background-image .4s;
          background: no-repeat center center / cover;
        }
        span {
          color: #fff;
          width: 100%;
          text-align: right;
          background: linear-gradient(rgba(0, 0, 0, 0.5), transparent);
          position: absolute;
          top: 0;
          right: 0;
          font-size: 21px;
          padding: 6px 10px;
          border-radius: 8px;
        }
      }
      .right {
        color: #fff;
        width: 100%;
        padding-left: 30px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .top {
          .title {
            font-size: 28px;
            font-weight: bold;
            line-height: 1.5em;
          }
          .user {
            display: flex;
            align-items: center;
            margin-top: 15px;
            .avatar {
              width: 50px;
              height: 50px;
              margin-right: 15px;
              border-radius: 50%;
              background: no-repeat center center / cover;
              transition: background-image .4s;
            }
            span {
              color: rgba(255, 255, 255, 0.8);
              font-size: 22px;
            }
          }
        }
        .description {
          height: 3em;
          font-size: 18px;
          line-height: 1.5em;
          p {
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.5em;
          }
          >div {
            display: flex;
            align-items: center;
            justify-content: space-between;
            div {
              width: 90%;
            }
          }
        }
      }
    }
    .btns {
      color: #fff;
      padding: 0 85px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      div {
        text-align: center;
        font-size: 20px;
        span {
          font-size: 35px;
        }
        p {
          margin-top: 10px;
        }
      }
    }
  }
  .mid-nav {
    position: sticky;
    top: 90px;
    transition: background-image .4s;
    background: no-repeat center bottom / cover;
    .mid-nav-in {
      height: 90px;
      padding: 0 10px 0 25px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #fff;
      border-top-left-radius: 40px;
      border-top-right-radius: 40px;
      div {
        height: 100%;
        display: flex;
        align-items: center;
      }
      .left {
        span:first-child {
          font-size: 35px;
          margin-right: 25px;
          font-weight: bold;
        }
        span:nth-child(2) {
          font-size: 26px;
        }
        span:last-child {
          color: #808080;
          font-size: 20px;
        }
      }
      .sub {
        color: #808080;
        padding-right: 20px;
        font-size: 30px;
        span:last-child {
          font-size: 18px;
          line-height: 1em;
        }
      }
      .unsub {
        color: #fff;
        width: 180px;
        height: 70px;
        justify-content: center;
        font-size: 20px;
        border-radius: 50PX;
        background: #ff3a3a;
      }
    }
  }
  .main-list {
    li {
      height: 100px;
      display: flex;
      align-items: center;
      >span {
        width: 85px;
        text-align: center;
        flex-shrink: 0;
      }
      div {
        width: 100%;
        height: 75%;
        display: flex;
        align-items: center;
        overflow: hidden;
      }
      >div {
        justify-content: space-between;
        .left {
          color: #aeaeae;
          align-items: unset;
          flex-direction: column;
          justify-content: space-between;
          p {
            line-height: 1em;
          }
          .top {
            .can {
              color: #333;
            }
          }
          .bottom {
            font-size: 18px;
            display: flex;
            align-items: center;
            .icon {
              margin-right: 5px;
              font-size: 35px;
              vertical-align: middle;
            }
            .sq, .hq {
              font-size: 30px;
            }
            .vip, .sq, .hq {
              color: #fe672e;
            }
            .listen, .only {
              color: #ff3a3a;
            }
          }
        }
        .right {
          color: #b3b3b3;
          width: unset;
          font-size: 32px;
          flex-shrink: 0;
          padding-right: 30px;
          span {
            margin-left: 25px;
          }
        }
      }
    }
  }
  .subscribers {
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
    ul {
      overflow: hidden;
      li {
        float: left;
        margin-left: 20px;
        img {
          width: 55px;
          height: 55px;
          border-radius: 50%;
        }
      }
    }
    p {
      color: #999;
      font-size: 20px;
    }
  }
  .details {
    color: #fff;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 6;
    background: no-repeat center center / cover;
    .close {
      font-size: 30px;
      position: fixed;
      top: 30px;
      right: 30px;
    }
    .main {
      overflow: auto;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 140px;
      .cover {
        width: 340px;
        margin: 120px auto 0;
        display: flex;
        flex-direction: column;
        div {
          width: 340px;
          height: 340px;
          margin: 0 auto;
          border-radius: 8px;
          background: no-repeat center center / cover;
        }
      }
      .info {
        padding: 40px 65px 45px;
        background: url('../assets/img/album-playlist/line.png') no-repeat bottom center / 100% auto;
        .name {
          text-align: center;
          font-size: 28px;
          font-weight: bold;
          line-height: 1.5em;
        }
      }
      .tags {
        display: flex;
        align-items: center;
        padding: 25px 55px;
        span {
          margin-right: 15px;
          line-height: 35px;
          font-size: 17px;
        }
        span:first-child {
          font-size: 22px;
        }
        .tag-list {
          padding: 0 15px;
          border-radius: 50PX;
          background: rgba(255, 255, 255, 0.15);
        }
      }
      .description {
        font-size: 21px;
        padding: 0 55px;
      }
    }
    .operate {
      text-align: center;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 60px;
      a, span {
        color: #fff;
        width: 6em;
        display: inline-block;
        margin: 0 17.5px;
        line-height: 2.2em;
        border-radius: 50PX;
        border: 1.5px solid rgba(255, 255, 255, 0.6);
      }
    }
  }
  .details-show {
    animation: opacity-show .2s linear;
  }
  .details-hide {
    animation: opacity-hide .2s linear;
  }
}
</style>
