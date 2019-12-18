<template>
  <div class="album-page web-page">
    <div class="nav" :style="{ backgroundImage: slideToTop ? `url(${coverUrlBlur})` : '' }">
      <div class="left">
        <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
        <div>
          <p class="title one-line-ellipsis">{{title}}</p>
          <p class="description one-line-ellipsis">{{getGLOBAL('album').copywriter}}</p>
        </div>
      </div>
      <div class="right">
        <span>&#xe677;</span>
        <span>&#xe61f;</span>
      </div>
    </div>
    <scroll ref="scroll" class="web-page" :up="getScrollUp()">
      <div class="title-area" :style="{ backgroundImage: `url(${coverUrlBlur})` }">
        <div ref="alInfo" class="album-info" :style="{ opacity: opacity }">
          <div class="left" @click="showDetailWin()">
            <img src="../assets/img/album-playlist/cover-top.svg" alt="">
            <div class="cover" :style="{ backgroundImage: `url(${data.coverUrlBlob})` }"></div>
          </div>
          <div class="right">
            <div class="top">
              <p class="title two-line-ellipsis" @click="showDetailWin()">{{data.name}}{{data.alias.length === 0 ? '' : `(${data.alias[0]})`}}</p>
              <div class="user" @click.stop="goArtist(data.arid)">
                <span>歌手：</span>
                <span>{{data.arname}} &#xe624;</span>
              </div>
            </div>
            <div class="description" @click="showDetailWin()">
              <p>发行时间: {{timestampToTime(data.publishTime, 'YMD', '.') + (data.description === '' ? ' &#xe624;' : '')}}</p>
              <div v-if="data.description !== ''">
                <div>
                  <template v-for="(i, index) in data.description.split('\n')">
                    <p v-if="index < 1" :key="index" class="one-line-ellipsis">{{i === '' ? '&nbsp;' : i}}</p>
                  </template>
                </div>
                <span>&nbsp; &#xe624;</span>
              </div>
            </div>
          </div>
        </div>
        <div ref="btns" class="btns" :style="{ opacity: opacity }">
          <div @click="goComments(3, data.id, data.arid, data.name, data.arname, data.coverUrlBlob)">
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
      <!-- 中部导航 -->
      <div class="mid-nav" :style="{ backgroundImage: `url(${coverUrlBlur})` }">
        <div class="mid-nav-in">
          <template v-if="musicList.length !== 0">
            <div class="left">
              <span>&#xe67e;</span>
              <span>全部播放</span>
              <span>(共{{data.trackCount}}首)</span>
            </div>
            <div v-if="data.subscribed" class="sub" @click="sub()">
              <span>&#xe627;</span>
              <span>{{data.subscribedCount}}</span>
            </div>
            <div v-else class="unsub" @click="sub()">
              <span>&#xe666; 收藏 ({{formatCount(data.subscribedCount)}})</span>
            </div>
          </template>
        </div>
      </div>
      <!-- 歌曲列表 -->
      <div class="main-list">
        <ul v-for="(value, name, index) in pageListData" :key="index">
          <p v-if="Object.keys(pageListData).length !== 1" class="disc-num">{{name}}</p>
          <li v-for="(j, jndex) in value" :key="jndex">
            <span :style="{ color: j.song.id === getGLOBAL('playingId') ? '#ff2e2e' : 'unset' }" v-html="j.song.id === getGLOBAL('playingId') ? '&#xe688;' : (jndex + 1)"></span>
            <div>
              <div class="left" @click="goPlay(j.song.id, j.privilege.pl, musicList, musicListIds)">
                <p class="top one-line-ellipsis">
                  <span :class="{ 'can': j.privilege.pl }">{{j.song.name}}</span>
                  <span v-if="j.alia !== ''">({{j.alia}})</span>
                </p>
                <p class="bottom">
                  <span v-if="j.privilege.fee === 1" class="icon vip">&#xe68b;</span>
                  <span v-if="j.privilege.flag === 1092" class="icon listen">&#xe68d;</span>
                  <span v-if="/64|68|1092/.test(j.privilege.flag)" class="icon only">&#xe68c;</span>
                  <span v-if="j.privilege.maxbr === 999000" class="icon sq">&#xe659;</span>
                  <span class="one-line-ellipsis">{{j.artist}} - {{j.album.name}}</span>
                </p>
              </div>
              <div class="right">
                <span v-if="j.mv !== 0">&#xe609;</span>
                <span @click="SET_PAGE_DATA(['info', 'id', j.song.id]);SET_WINDOWS(['info', true])">&#xe61f;</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </scroll>
    <!-- 弹窗 -->
    <div v-if="details" ref="details" class="details details-show" :style="{ backgroundImage: `url(${coverUrlBlur})` }" @click="detailsHide()">
      <span class="close">&#xe62b;</span>
      <div class="main">
        <div class="cover">
          <img src="../assets/img/album-playlist/cover-top.svg" alt="">
          <div :style="{ backgroundImage: `url(${data.coverUrlBlob})` }"></div>
        </div>
        <div class="info">
          <p class="name">{{data.name}}</p>
          <p v-for="(i, index) in data.transNames" :key="index" class="trans-names">{{i}}</p>
          <p class="alias">{{data.alias.length === 0 ? '' : data.alias[0]}}</p>
        </div>
        <div class="description">
          <p v-if="data.company != null" class="com">发行公司：{{data.company}}</p>
          <p v-if="data.subType != null" class="type">专辑类别：{{data.subType}}</p>
          <br>
          <p v-if="data.description === ''">暂无专辑介绍</p>
          <p v-for="(i, index) in data.description.split('\n')" :key="index">{{i === '' ? '&nbsp;' : i}}</p>
        </div>
      </div>
      <div class="operate">
        <a :href="data.coverUrl" :download="data.coverImgId" @click.stop="">保存封面</a>
        <a href="javascript:void(0)" @click.stop="downloadByBlob(data.coverUrl, `${data.name}_${data.coverImgId}`)">保存封面</a>
      </div>
    </div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import scroll from './plugins/scroll'
import { goArtist, goComments, goPlay, goLogin } from '../utils/function'
import { mapMutations } from 'vuex'
import { getGLOBAL } from '../utils/store'
import { albumDetailApi, albumSubApi, batchApi } from '../utils/api'
import { imgToBlob, formatCount, timestampToTime, projectMainCoreData, downloadByBlob } from '../utils/tools'

export default {
  name: 'album',
  components: { scroll },
  data() {
    return {
      // 方法
      getGLOBAL,
      formatCount,
      timestampToTime,
      downloadByBlob,
      goArtist,
      goComments,
      goPlay,
      // 交互数据
      opacity: 1,
      title: '专辑',
      details: false,
      slideToTop: false,
      // 请求的数据
      musicList: [],
      musicListIds: [],
      pageListData: {},
      coverUrlBlur: getGLOBAL('1px')['888888'],
      data: {
        // 公共字段
        id: null,
        name: getGLOBAL('album').name,
        arid: null,
        arname: '',
        coverImgId: 0,
        coverUrl: getGLOBAL('1px')['eeeeee'],
        coverUrlBlob: getGLOBAL('1px')['eeeeee'],
        shareCount: 0,
        subscribed: false,
        subscribedCount: 0,
        commentCount: 0,
        trackCount: 0,
        description: '',
        // 专辑字段
        alias: [],
        company: '',
        subType: '',
        publishTime: 0
      }
    }
  },
  mounted() {
    // 复制
    this.clipboard = new Clipboard(this.$refs.share, {
      text: () => {
        if (getGLOBAL('isLogin')) {
          return `分享${this.data.arname}的专辑《${this.data.name}》: http://music.163.com/album/${this.data.id}/?userid=${getGLOBAL('userInfo').uid} (来自@网易云音乐 by KA)`
        } else {
          return `分享${this.data.arname}的专辑《${this.data.name}》: http://music.163.com/album/${this.data.id} (来自@网易云音乐 by KA)`
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
        callback: () => { this.init() },
        onScroll: (y, isUp) => {
          let targetHeight = this.$refs.alInfo.offsetHeight + this.$refs.btns.offsetHeight
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
            this.title = '专辑'
          }
        }
      }
    },

    // 获取数据
    init() {
      // 专辑动态信息
      batchApi({
        alid: getGLOBAL('album').id,
        batch: 'album-detail-dynamic'
      }).then(succ => {
        console.log('专辑动态信息（success）：', succ)
        this.data.subscribed = succ['/api/album/detail/dynamic'].isSub
        this.data.subscribedCount = succ['/api/album/detail/dynamic'].subCount
      }).catch(err => {
        console.warn('专辑动态信息（error）：', err)
      })
      // 专辑信息
      albumDetailApi({
        id: getGLOBAL('album').id,
      }).then(succ => {
        console.log('专辑详情（success）：', succ)
        this.data.id = succ.album.id
        this.data.name = succ.album.name
        this.data.arid = succ.album.artist.id
        this.data.arname = succ.album.artist.name
        this.data.coverImgId = succ.album.picId_str
        this.data.coverUrl = succ.album.picUrl
        this.data.shareCount = succ.album.info.shareCount
        this.data.commentCount = succ.album.info.commentCount
        this.data.trackCount = succ.album.size
        this.data.description = (succ.album.description === null || succ.album.description === '') ? '' : succ.album.description
        this.data.alias = succ.album.alias
        this.data.company = succ.album.company
        this.data.subType = succ.album.subType
        this.data.publishTime = succ.album.publishTime
        // 生成歌曲列表
        this.mainMusicListDataSet(succ.songs)
        // 图片预热
        imgToBlob(succ.album.picUrl + '?imageView=1&thumbnail=225x0', res => { this.data.coverUrlBlob = res })        // cover
        imgToBlob(succ.album.picUrl + '?imageView=1&thumbnail=225x0', blur => { this.coverUrlBlur = blur }, 100, -0.1)  // blur
        // 隐藏loading
        this.$refs.scroll.upEndSucc({ more: false })
      }).catch(err => {
        console.warn('专辑详情（error）：', err)
        this.$refs.scroll.upEndErr()
      })
    },

    // 主歌曲数组数据
    mainMusicListDataSet(data) {
      for (let i = 0; i < data.length; i++) {
        // 艺术家信息
        let tempArtist = []
        for (let j = 0; j < data[i].ar.length; j++) {
          tempArtist.push(data[i].ar[j].name)
        }
        // 当前页数据、专辑分碟
        if (!this.pageListData.hasOwnProperty(`Disc ${data[i].cd}`)) {
          this.pageListData[`Disc ${data[i].cd}`] = []
        }
        this.pageListData[`Disc ${data[i].cd}`].push({
          song: {
            id: data[i].id,
            name: data[i].name
          },
          album: {
            name: data[i].al.name
          },
          artist: tempArtist.toString().replace(/,/g, '/'),
          mv: data[i].mv,
          alia: data[i].alia.toString().replace(/,/g, '/'),
          privilege: {
            pl: data[i].privilege.pl,
            fee: data[i].privilege.fee,
            flag: data[i].privilege.flag,
            maxbr: data[i].privilege.maxbr
          }
        })
        // 无法播放歌曲不插入主数组 continue
        if (data[i].privilege.pl === 0) continue
        // 主数据
        this.musicListIds.push(data[i].id)
        this.musicList.push(projectMainCoreData(
          data[i],
          {
            id: this.data.id,
            name: `专辑「${this.data.name}」`,
            from: 'album'
          }
        ))
      }
    },

    // 收藏
    sub() {
      if (!getGLOBAL('isLogin')) goLogin('album', getGLOBAL('album').id)
      this.$loading()
      albumSubApi({
        t: this.data.subscribed ? 0 : 1, // 1.收藏 0.取消
        id: getGLOBAL('album').id
      }).then(succ => {
        console.log('收藏专辑（success）：', succ)
        this.$rloading()
        if (this.data.subscribed) {
          this.$toast('已取消收藏')
          this.data.subscribed = false
        } else {
          this.$toast('收藏成功')
          this.data.subscribed = true
        }
      }).catch(err => {
        console.warn('收藏专辑（error）：', err)
        this.$rloading()
      })
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
      this.details = true
      imgToBlob(this.data.coverUrl, res => { this.data.coverUrl = res })
    },
    detailsHide() {
      this.$refs.details.classList.remove('details-show')
      this.$refs.details.classList.add('details-hide')
      setTimeout(() => { this.details = false }, 190)
    }
  },
  beforeRouteLeave(to, from, next) {
    if (this.details) {
      this.detailsHide()
      return next(false)
    }
    next()
  }
}
</script>

<style lang="scss">
.album-page {
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
    .album-info {
      padding: 35px 28px 40px;
      display: flex;
      justify-content: space-between;
      .left {
        width: 225px;
        margin-top: -35px;
        position: relative;
        display: flex;
        flex-shrink: 0;
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
    .disc-num {
      padding: 0 20px;
      font-size: 20px;
      line-height: 45px;
      background: #f3f3f3;
    }
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
  }
  .details {
    color: #fff;
    width: 100%;
    height: 100%;
    position: absolute;
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
        .trans-names, .alias {
          color: #c0bcbe;
          font-size: 20px;
          text-align: center;
          line-height: 1.5em;
        }
      }
      .description {
        font-size: 21px;
        padding: 45px 55px 0;
        .com, .type {
          line-height: 2em;
        }
      }
    }
    .operate {
      text-align: center;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 60px;
      a {
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
