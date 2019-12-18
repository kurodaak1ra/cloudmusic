<template>
  <div ref="artistPage" class="artist-page web-page">
    <!-- nav -->
    <div ref="nav" class="nav">
      <div class="left one-line-ellipsis">
        <span class="back-icon" @click="$router.go(-1)">&#xe676;</span>
        <div v-if="slideToTop">{{list.home.name}} <template v-for="(i, index) in list.home.transNames">{{i}}{{list.home.transNames.length === index + 1 ? '' : '/'}}</template></div>
      </div>
      <div class="right one-line-ellipsis">
        <span v-if="slideToTop && !list.home.follow" class="subscribe" @click="follow(getGLOBAL('artist').id, 1, 'current')">&#xe666; 收藏</span>
        <span ref="share" @click="share()">&#xe674;</span>
        <span>&#xe61f;</span>
      </div>
    </div>
    <!-- 艺术家信息 -->
    <div class="artist-details-area">
      <div class="bg" :style="{ backgroundImage: `url(${list.home.coverUrl})`, backgroundPositionY: -scrollLength / 3 + 'px', filter: `brightness(${filter})` }"></div>
      <div ref="artistDetails" class="artist-details" :style="{ opacity: opacity }">
        <div class="left">
          <p class="nickname">{{list.home.name}}</p>
          <p class="fans">粉丝{{list.home.fans}}</p>
        </div>
        <div class="right">
          <template v-if="list.home.follow">
            <p class="follow">{{list.home.followedDays}}</p>
            <span class="follow-yes" @click="follow(getGLOBAL('artist').id, 0, 'current')">&#xe64b;</span>
          </template>
          <div v-else class="follow-no" @click="follow(getGLOBAL('artist').id, 1, 'current')">&#xe666; 关注</div>
        </div>
      </div>
      <div ref="midNav" class="mid-nav">
        <div :class="{ 'active': pageIndex === 0 }" @click="pageIndex = 0">
          <span>主页</span>
          <i></i>
        </div>
        <div :class="{ 'active': pageIndex === 1 }" @click="pageIndex = 1">
          <span>歌曲</span>
          <i></i>
        </div>
        <div :class="{ 'active': pageIndex === 2 }" @click="pageIndex = 2">
          <span>专辑<span v-if="list.home.albumSize !== 0">{{list.home.albumSize}}</span></span>
          <i></i>
        </div>
        <div :class="{ 'active': pageIndex === 3 }" @click="pageIndex = 3">
          <span>视频<span v-if="list.home.mvSize !== 0">{{list.home.mvSize}}</span></span>
          <i></i>
        </div>
      </div>
    </div>
    <!-- 列表数据 -->
    <div class="main-content" :style="{ height: secPageHeight + 'px' }">
      <swiper ref="mySwiper" :options="swiperOption()">
        <!-- 主页 -->
        <swiper-slide>
          <scroll ref="firScroll" class="home" :style="{ overflow: !slideToTop ? 'hidden' : 'auto' }" :up="getScrollUp(0, true)">
            <!-- 主页歌曲 -->
            <ul v-if="list.home.song.length !== 0" class="song">
              <p class="song-title" @click="goPlay(list.home.song[0].song.id, list.home.song[0].privilege.pl, 'song')">&#xe67e; 播放热门50</p>
              <li v-for="(i, index) in list.home.song" :key="index">
                <span :style="{ color: i.song.id === getGLOBAL('playingId') ? '#ff2e2e' : '#aeaeae' }" v-html="i.song.id === getGLOBAL('playingId') ? '&#xe688;' : (index + 1)"></span>
                <div>
                  <div class="left" @click="goPlay(i.song.id, i.privilege.pl, 'home')">
                    <p class="list-top one-line-ellipsis">
                      <span :class="{ 'can': i.privilege.pl }">{{i.song.name}}</span>
                      <span v-if="i.alia !== ''">({{i.alia}})</span>
                    </p>
                    <p class="list-bottom">
                      <span v-if="i.privilege.fee === 1" class="icon vip">&#xe68b;</span>
                      <span v-if="i.privilege.flag === 1092" class="icon listen">&#xe68d;</span>
                      <span v-if="/64|68|1092/.test(i.privilege.flag)" class="icon only">&#xe68c;</span>
                      <span v-if="i.privilege.maxbr === 999000" class="icon sq">&#xe659;</span>
                      <span class="one-line-ellipsis">{{i.artist}} - {{i.album.name}}</span>
                    </p>
                  </div>
                  <div class="right">
                    <span v-if="i.mv !== 0">&#xe609;</span>
                    <span @click="SET_PAGE_DATA(['info', 'id', i.song.id]);SET_WINDOWS(['info', true])">&#xe61f;</span>
                  </div>
                </div>
              </li>
              <p class="more" @click="pageIndex = 1">更多热歌 &#xe624;</p>
            </ul>
            <!-- 影响力 -->
            <div class="honor">
              <p class="honor-title">影响力 <span @click="list.home.honorWin = true">&#xe63d;</span></p>
              <div class="text">
                <p class="honor-heat">&#xe6a0; 歌手热度 {{list.home.honor.score}}</p>
                <p v-if="list.home.honor.totalChartTimes !== 0" class="honor-official-list">&#xe6a0; 歌曲进入网易云音乐官方榜{{list.home.honor.totalChartTimes}}次</p>
              </div>
              <swiper v-if="list.home.honor.chartSongs.length !== 0" class="honor-list">
                <swiper-slide v-for="(i, index) in list.home.honor.chartSongs" :key="index">
                  <div class="box">
                    <div class="cover" :style="{ backgroundImage: `url(${i.coverUrl}?imageView=1&thumbnail=140x0)` }">
                      <img src="../assets/img/artist/mv.png" alt="">
                    </div>
                    <p><template v-for="(j, jndex) in i.chartAggregation">{{j}}{{i.chartAggregation.length === jndex + 1 ? '' : '-'}}</template></p>
                  </div>
                </swiper-slide>
              </swiper>
              <div v-if="list.home.honorWin" class="honor-win">
                <i></i>
                <p>歌手热度：根据最近一周内，艺人歌曲试听量、粉丝增量及话题讨论量计算的综合热度指数，每天更新</p>
                <p>歌手排名：Ta在歌手榜中的实时排名，每天更新</p>
                <p>歌曲荣誉：统计自2017年起，歌曲进入云音乐官方榜的荣誉记录</p>
              </div>
            </div>
            <!-- 歌手简介 -->
            <div class="introduction">
              <p class="introduction-title">歌手简介</p>
              <template v-for="(i, index) in list.home.introduction">
                <p :key="index" class="introduction-details">{{i}}</p>
              </template>
              <p class="more" @click="$router.push({ path: '/artist-details' })">更多信息 &#xe624;</p>
            </div>
            <!-- 相似艺人 -->
            <div class="similar">
              <p class="similar-title">相似艺人</p>
              <ul class="similar-list">
                <li v-for="(i, index) in list.home.similar" :key="index" @click="goArtist(i.id)">
                  <div class="avatar" :style="{ backgroundImage: `url(${i.img1v1Url}` }"></div>
                  <p class="name">{{i.name}}</p>
                  <p class="fans">{{formatCount(i.fansCount)}}粉丝</p>
                  <span v-if="i.followed" class="follow-yes">已关注</span>
                  <span v-else class="follow-no" @click.stop="follow(i.id, 1, 'osusume', index)">关注</span>
                </li>
              </ul>
            </div>
          </scroll>
        </swiper-slide>
        <!-- 歌曲 -->
        <swiper-slide>
          <scroll ref="secScroll" class="songs" :style="{ overflow: !slideToTop ? 'hidden' : 'auto' }" :up="getScrollUp(1, false)">
            <p class="songs-title">
              <span>&#xe626; 收藏热门50</span>
              <span>&#xe658; 管理</span>
            </p>
            <ul>
              <li v-for="(i, index) in list.song.data" :key="index">
                <span :style="{ color: i.song.id === getGLOBAL('playingId') ? '#ff2e2e' : '#aeaeae' }" v-html="i.song.id === getGLOBAL('playingId') ? '&#xe688;' : (index + 1)"></span>
                <div>
                  <div class="left" @click="goPlay(i.song.id, i.privilege.pl, 'song')">
                    <p class="list-top one-line-ellipsis">
                      <span :class="{ 'can': i.privilege.pl }">{{i.song.name}}</span>
                      <span v-if="i.alia !== ''">({{i.alia}})</span>
                    </p>
                    <p class="list-bottom">
                      <span v-if="i.privilege.fee === 1" class="icon vip">&#xe68b;</span>
                      <span v-if="i.privilege.flag === 1092" class="icon listen">&#xe68d;</span>
                      <span v-if="/64|68|1092/.test(i.privilege.flag)" class="icon only">&#xe68c;</span>
                      <span v-if="i.privilege.maxbr === 999000" class="icon sq">&#xe659;</span>
                      <span class="one-line-ellipsis">{{i.artist}} - {{i.album.name}}</span>
                    </p>
                  </div>
                  <div class="right">
                    <span v-if="i.mv !== 0">&#xe609;</span>
                    <span @click="SET_PAGE_DATA(['info', 'id', i.song.id]);SET_WINDOWS(['info', true])">&#xe61f;</span>
                  </div>
                </div>
              </li>
            </ul>
          </scroll>
        </swiper-slide>
        <!-- 专辑 -->
        <swiper-slide>
          <scroll ref="thirScroll" class="album" :style="{ overflow: !slideToTop ? 'hidden' : 'auto' }" :up="getScrollUp(2, false)">
            <p v-if="list.album.data.length !== 0" class="album-title">
              <span class="list-type">按发行时间排序</span>
              <span>&#xe658; 排序</span>
            </p>
            <ul>
              <li v-for="(i, index) in list.album.data" :key="index">
                <div class="left">
                  <div class="cover" :style="{ backgroundImage: `url(${i.picUrl}?imageView=1&thumbnail=90x0)` }"></div>
                  <img src="../assets/img/collect/digital-album.svg" alt="">
                </div>
                <div class="right">
                  <p class="name">{{i.name}}</p>
                  <p class="details">{{timestampToTime(i.publishTime, 'YMD', '.')}} 歌曲 {{i.size}}</p>
                </div>
              </li>
            </ul>
          </scroll>
        </swiper-slide>
        <!-- 视频 -->
        <swiper-slide>
          <scroll ref="fourScroll" class="video" :style="{ overflow: !slideToTop ? 'hidden' : 'auto' }" :up="getScrollUp(3, false)">
            <p v-if="list.video.data.length !== 0" class="video-title">
              <span>全部</span>
              <span>
                <em class="active">全部</em>&nbsp; | &nbsp;<em>MV</em>
              </span>
            </p>
            <ul>
              <li v-for="(i, index) in list.video.data" :key="index">
                <div class="cover" :style="{ backgroundImage: `url(${i.coverUrl}?imageView=1&thumbnail=230x0)` }">
                  <span>&#xe667;{{i.playTime}}</span>
                </div>
                <div class="info">
                  <p class="name">{{i.title}}</p>
                  <p class="date">{{timestampToTime(i.publishTime, 'YMD', '.')}}</p>
                </div>
              </li>
            </ul>
          </scroll>
        </swiper-slide>
      </swiper>
    </div>
    <!-- 透明遮罩 -->
    <div v-if="list.home.honorWin" class="tr-mask" @touchstart="list.home.honorWin = false"></div>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import scroll from './plugins/scroll'
import { mapMutations } from 'vuex'
import { getGLOBAL } from '../utils/store'
import { goPlay, goUser, goLogin, goArtist } from '../utils/function'
import { batchApi, artistTopSongApi, artistAlbumApi, artistVideoApi, artistSubApi } from '../utils/api'
import { formatCount, timestampToTime, projectMainCoreData } from '../utils/tools'

export default {
  name: 'artist',
  inject: ['reload'],
  components: { scroll },
  data() {
    return {
      // 方法
      getGLOBAL,
      goUser,
      formatCount,
      timestampToTime,
      // 变量
      pageIndex: 0,
      list: {
        home: {
          name: 'NULL',
          transNames: [],
          introduction: [],
          albumSize: 0,
          musicSize: 0,
          mvSize: 0,
          coverUrl: getGLOBAL('1px')['eeeeee'],
          fans: 0,
          follow: false,
          followedDays: '已关注0天',
          honor: {
            score: 0,
            chartSongs: []
          },
          honorWin: false,
          more: false,
          song: [],
          original: [],
          similar: []
        },
        song: {
          more: false,
          data: [],
          original: []
        },
        album: {
          offset: 0,
          data: []
        },
        video: {
          offset: 0,
          data: []
        }
      },
      // 滑动数据
      opacity: 1,
      filter: 0.8,
      secPageHeight: 0,
      scrollLength: 0,
      slideToTop: false
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },
  watch: {
    pageIndex(newer, older) {
      this.swiper.slideTo(newer, 300)
    }
  },
  mounted() {
    // 设置单页高度
    this.secPageHeight = document.body.offsetHeight - this.$refs.nav.offsetHeight - this.$refs.midNav.offsetHeight

    // 分享
    this.clipboard = new Clipboard(this.$refs.share, {
      text: () => {
        if (getGLOBAL('isLogin')) {
          return `分享歌手${this.list.home.name} http://music.163.com/artist?id=${getGLOBAL('artist').id}&userid=${getGLOBAL('userInfo').uid} (来自@网易云音乐 Write by KA)`
        } else {
          return `分享歌手${this.list.home.name} http://music.163.com/artist?id=${getGLOBAL('artist').id} (来自@网易云音乐 Write by KA)`
        }
      }
    })

    // 整页滑动
    let detailsAreaHeight = this.$refs.artistDetails.offsetHeight - this.$refs.nav.offsetHeight
    this.$refs.artistPage.addEventListener('scroll', ev => {
      let y = ev.target.scrollTop
      // 是否拉到顶端及中途操作
      if (y >= detailsAreaHeight) {
        this.slideToTop = true
        this.scrollLength = -detailsAreaHeight
        this.opacity = 0
      } else {
        this.slideToTop = false
        // 背景缓慢滑动
        this.scrollLength = -y
        // 明暗度
        let dark = 1 - y / (detailsAreaHeight - 50)
        // 透明度
        this.opacity = dark
        // 背景明暗度
        if (dark <= 0.3) {
          this.filter = 0.3
        } else if (dark >= 0.8) {
          this.filter = 0.8
        } else {
          this.filter = dark
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
    getScrollUp(type, auto) {
      return {
        auto: auto,
        empty: '暂时没有内容',
        callback: () => {
          if (type === 0) {
            this.homeFun()
          } else if (type === 1) {
            this.songFun()
          } else if (type === 2) {
            this.albumFun()
          } else if (type === 3) {
            this.videoFun()
          }
        }
      }
    },

    // swiper
    swiperOption() {
      let _this = this
      return {
        autoHeight: true,
        on: {
          slideChangeTransitionEnd: function() {
            _this.pageIndex = this.activeIndex
            if (this.activeIndex === 1 && _this.list.song.data.length === 0) {
              _this.$refs.secScroll.init()
            } else if (this.activeIndex === 2 && _this.list.album.data.length === 0) {
              _this.$refs.thirScroll.init()
            } else if (this.activeIndex === 3 && _this.list.video.data.length === 0) {
              _this.$refs.fourScroll.init()
            }
          }
        }
      }
    },

    // 主页
    homeFun() {
      let data = ['artist-follow-count', 'artist-head-info', 'artist-top-song', 'artist-song-honor', 'similar-artist']
      batchApi({
        batch: data.toString(),
        arid: getGLOBAL('artist').id,
        limit: 5
      }).then(succ => {
        console.log('艺术家主页数据请求（success）:', succ)
        this.list.home = {
          name: succ['/api/artist/head/info/get'].data.artist.name,
          transNames: succ['/api/artist/head/info/get'].data.artist.transNames,
          introduction: succ['/api/artist/head/info/get'].data.artist.briefDesc.split('\n'),
          albumSize: succ['/api/artist/head/info/get'].data.artist.albumSize,
          musicSize: succ['/api/artist/head/info/get'].data.artist.musicSize,
          mvSize: succ['/api/artist/head/info/get'].data.artist.mvSize,
          coverUrl: succ['/api/artist/head/info/get'].data.artist.cover,
          fans: succ['/api/artist/follow/count/get'].data.fansCnt,
          follow: succ['/api/artist/follow/count/get'].data.follow,
          followedDays: succ['/api/artist/follow/count/get'].data.followDay,
          honor: succ['/api/charts/artist/song/honor/get'].data,
          honorWin: false,
          more: succ['/api/artist/top/song'].more,
          song: this.createPagePlayList(succ['/api/artist/top/song'].songs),
          original: succ['/api/artist/top/song'].songs,
          similar: succ['/api/v1/similar/artist/get'].artists
        }
        this.SET_PAGE_DATA(['artist', 'name', succ['/api/artist/head/info/get'].data.artist.name])
        // 隐藏loading
        this.$refs.firScroll.upEndSucc({ more: false })
      }).catch(err => {
        console.warn('艺术家主页数据请求（error）:', err)
        this.$refs.firScroll.upEndErr()
      })
    },

    // 歌曲
    songFun() {
      artistTopSongApi({
        id: getGLOBAL('artist').id,
        limit: 50
      }).then(succ => {
        console.log('获取歌手top 50（success）：', succ)
        this.list.song = {
          more: succ.more,
          data: this.createPagePlayList(succ.songs),
          original: succ.songs
        }
        // 隐藏loading
        this.$refs.secScroll.upEndSucc({ more: false })
      }).catch(err => {
        console.warn('获取歌手top 50（error）：', err)
        this.$refs.firScroll.upEndErr()
      })
    },

    // 专辑
    albumFun() {
      artistAlbumApi({
        id: getGLOBAL('artist').id,
        limit: 10,
        offset: this.list.album.offset
      }).then(succ => {
        console.log('获取艺术家专辑（success）：', succ)
        this.list.album.data = this.list.album.data.concat(succ.hotAlbums)
        this.list.album.offset += 1
        // 隐藏loading
        this.$refs.thirScroll.upEndSucc({ more: succ.more, empty: this.list.album.data.length === 0 && !succ.more })
      }).catch(err => {
        console.warn('获取艺术家专辑（error）：', err)
        this.$refs.thirScroll.upEndErr()
      })
    },

    // 视频
    videoFun() {
      artistVideoApi({
        id: getGLOBAL('artist').id,
        limit: 10,
        offset: this.list.video.offset
      }).then(succ => {
        console.log('获取艺术家视频（success）：', succ)
        this.list.video.data = this.list.video.data.concat(succ.data)
        this.list.video.offset += 1
        // 隐藏loading
        this.$refs.fourScroll.upEndSucc({ more: succ.hasMore, empty: this.list.video.data.length === 0 && !succ.hasMore })
      }).catch(err => {
        console.warn('获取艺术家视频（error）：', err)
        this.$refs.fourScroll.upEndErr()
      })
    },

    // 播放
    goPlay(id, pl, from) {
      // 歌曲信息列表
      let data = from === 'home' ? this.list.home.original : this.list.song.original
      let tempMusicList = []
      let tempMusicListIds = []
      for (let i = 0; i < data.length; i++) {
        // 无法播放直接跳过
        if (data[i].privilege.pl === 0) continue
        // 全局歌曲列表
        tempMusicListIds.push(data[i].id)
        tempMusicList.push(projectMainCoreData(
          data[i],
          {
            id: getGLOBAL('artist').id,
            name: from === 'home' ? '歌手主页' : `${this.list.home.name}的「歌曲」`,
            from: 'artist'
          }
        ))
      }
      goPlay(id, pl, tempMusicList, tempMusicListIds)
    },

    // 当前页播放列表
    createPagePlayList(data) {
      let tempPlayList = []
      for (let i = 0; i < data.length; i++) {
        // 艺术家
        let tempArtist = []
        for (let j = 0; j < data[i].ar.length; j++) {
          tempArtist.push(data[i].ar[j].name)
        }
        // 当前页歌曲列表
        tempPlayList.push({
          song: {
            id: data[i].id,
            name: data[i].name
          },
          album: {
            name: data[i].al.name
          },
          mv: data[i].mv,
          alia: data[i].alia.toString().replace(/,/g, '/'),
          artist: tempArtist.toString().replace(/,/g, '/'),
          privilege: {
            pl: data[i].privilege.pl,
            fee: data[i].privilege.fee,
            flag: data[i].privilege.flag,
            maxbr: data[i].privilege.maxbr
          }
        })
      }
      return tempPlayList
    },

    // 收藏
    follow(id, fo, from, index) {
      if (!getGLOBAL('isLogin')) goLogin('artist', id)
      this.$loading()
      artistSubApi({
        id: id,
        t: fo
      }).then(succ => {
        console.log('收藏歌手（success）：', succ)
        this.$rloading()
        if (from === 'current') {
          if (this.list.home.follow) {
            this.list.home.follow = false
            this.$toast('取消收藏成功')
          } else {
            this.list.home.follow = true
            this.$toast('收藏成功')
          }
        } else {
          this.list.home.similar[index].followed = true
        }
      }).catch(err => {
        console.warn('收藏歌手（error）：', err)
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

    // 条其他艺术家
    goArtist(id) {
      goArtist(id)
      this.reload()
    }
  }
}
</script>

<style lang="scss">
.artist-page {
  overflow: auto;
  .bg {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-size: 100% auto;
    transition: background-image 0.5s linear;
  }
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
    >div {
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 35px;
    }
    .left {
      margin-right: 20px;
      overflow: hidden;
      .back-icon {
        font-size: 35px;
        margin-right: 30px;
      }
      div {
        font-size: 30px;
      }
    }
    .right {
      display: flex;
      font-size: 40px;
      align-items: center;
      .subscribe {
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 50PX;
        font-size: 20px;
        margin-right: 25px;
        background: #ff3a3a;
      }
      span:last-child {
        margin-left: 45px;
      }
    }
  }
  .mid-nav {
    height: 70px;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 0 45px;
    background: #fff;
    border-bottom: 1.5px solid #f5f5f5;
    border-top-left-radius: 40px;
    border-top-right-radius: 40px;
    .active {
      color: #dd4137;
      font-weight: bold;
      i {
        background: #dd4137;
      }
    }
    div {
      span {
        span {
          color: #949494;
          font-size: 15px;
          margin-left: 5px;
        }
      }
      i {
        display: block;
        width: 2em;
        height: 4px;
        border-radius: 4px;
        margin-top: 15px;
      }
    }
  }
  .artist-details-area {
    .artist-details {
      color: #fff;
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 370px 28px 35px;
      .left {
        .nickname {
          font-size: 35px;
          font-weight: bold;
        }
        .fans {
          opacity: 0.8;
          font-size: 22px;
          margin-top: 15px;
        }
      }
      .right {
        text-align: right;
        .follow {
          font-size: 20px;
          opacity: 0.8;
          margin-bottom: 12px;
        }
        .follow-yes {
          display: inline-block;
          width: 50px;
          height: 50px;
          text-align: center;
          line-height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
        }
        .follow-no {
          display: inline-block;
          width: 100px;
          height: 50px;
          line-height: 50px;
          text-align: center;
          border-radius: 50PX;
          font-size: 20px;
          background: #ff3a3a;
        }
      }
    }
  }
  .main-content {
    background: #fff;
    overflow: hidden;
    .swiper-container, .swiper-wrapper, .swiper-slide {
      height: 100% !important;
    }
    .home {
      .song {
        .song-title {
          font-size: 30px;
          font-weight: bold;
          line-height: 100px;
          padding-left: 28px;
        }
        li {
          height: 100px;
          display: flex;
          align-items: center;
          >span {
            width: 55px;
            text-align: right;
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
            margin-left: 25px;
            justify-content: space-between;
            .left {
              color: #aeaeae;
              align-items: unset;
              flex-direction: column;
              justify-content: space-between;
              p {
                line-height: 1em;
              }
              .list-top {
                .can {
                  color: #333;
                }
              }
              .list-bottom {
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
              font-size: 35px;
              flex-shrink: 0;
              padding-right: 28px;
              span {
                margin-left: 25px;
              }
            }
          }
        }
        .more {
          color: #666;
          text-align: center;
          line-height: 100px;
          font-size: 20px;
        }
      }
      .honor {
        padding: 28px 0;
        position: relative;
        border-top: 14px solid #f7f7f7;
        .honor-title {
          font-size: 30px;
          font-weight: bold;
          margin-bottom: 35px;
          padding-left: 28px;
          span {
            color: #ccc;
          }
        }
        .text {
          padding: 0 28px;
          .honor-official-list {
            margin-top: 25px;
          }
        }
        .honor-list {
          margin-top: 20px;
          .swiper-slide {
            padding: 0 28px;
            .box {
              display: flex;
              flex-wrap: nowrap;
              align-items: center;
              padding: 17px;
              background: #f5f5f5;
              border-radius: 12px;
              .cover {
                width: 140px;
                height: 140px;
                padding: 35px;
                border-radius: 8px;
                margin-right: 20px;
                background: no-repeat center center / cover;
                img {
                  opacity: 0.8;
                }
              }
            }
          }
        }
        .honor-win {
          color: #fff;
          position: absolute;
          top: 80px;
          left: 18px;
          right: 18px;
          z-index: 1;
          padding: 20px;
          font-size: 22px;
          border-radius: 6px;
          background: rgba(0, 0, 0, 0.8);
          i {
            display: block;
            width: 0px;
            height: 0px;
            border-top: 10px solid rgba(0, 0, 0, 0.8);
            border-left: 10px solid rgba(0, 0, 0, 0.8);
            border-right: 10px solid transparent;
            border-bottom: 10px solid transparent;
            transform: rotate(45deg);
            position: absolute;
            top: -10px;
            left: 115px;
          }
        }
      }
      .introduction {
        padding: 28px;
        border-top: 14px solid #f7f7f7;
        .introduction-title {
          font-size: 30px;
          font-weight: bold;
          margin-bottom: 35px;
        }
        .introduction-details {
          color: #666;
          line-height: 1.7em;
          font-size: 22px;
        }
        .more {
          color: #666;
          text-align: center;
          margin-top: 30px;
          font-size: 20px;
        }
      }
      .similar {
        padding: 28px 0;
        border-top: 14px solid #f7f7f7;
        .similar-title {
          font-size: 30px;
          font-weight: bold;
          margin-bottom: 35px;
          padding-left: 28px;
        }
        .similar-list {
          white-space: nowrap;
          overflow: auto;
          padding: 0 20px;
          li {
            color: #666;
            display: inline-block;
            width: 210px;
            border-radius: 6px;
            background: #f5f5f5;
            margin: 0 10px;
            padding: 25px 0;
            text-align: center;
            .avatar {
              display: inline-block;
              width: 90px;
              height: 90px;
              border-radius: 50%;
              background: no-repeat center center / cover;
            }
            .name {
              font-size: 20px;
              line-height: 1.75em;
            }
            .fans {
              font-size: 19px;
              line-height: 2em;
            }
            .follow-no {
              color: #fff;
              display: inline-block;
              width: 100px;
              height: 40px;
              font-size: 20px;
              line-height: 40px;
              text-align: center;
              border-radius: 50PX;
              background: linear-gradient(to right, #ff5e3b, #ff3635);
            }
            .follow-yes {
              display: inline-block;
              width: 100px;
              height: 40px;
              font-size: 20px;
              line-height: 40px;
              text-align: center;
              border-radius: 50PX;
              border: 1.5px solid #bbb;
            }
          }
        }
      }
    }
    .songs {
      .songs-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 28px;
        line-height: 100px;
      }
      li {
        height: 100px;
        display: flex;
        align-items: center;
        >span {
          width: 55px;
          text-align: right;
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
          margin-left: 25px;
          justify-content: space-between;
          .left {
            color: #aeaeae;
            align-items: unset;
            flex-direction: column;
            justify-content: space-between;
            p {
              line-height: 1em;
            }
            .list-top {
              .can {
                color: #333;
              }
            }
            .list-bottom {
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
            font-size: 35px;
            flex-shrink: 0;
            padding-right: 28px;
            span {
              margin-left: 25px;
            }
          }
        }
      }
    }
    .album {
      padding: 0 28px;
      .album-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 70px;
        .list-type {
          font-weight: bold;
        }
      }
      ul {
        padding-bottom: 15px;
      }
      li {
        display: flex;
        align-items: center;
        padding: 10px 0;
        .left {
          display: flex;
          align-items: center;
          padding-right: 15px;
          .cover {
            width: 90px;
            height: 90px;
            border-radius: 8px;
            background: no-repeat center center / cover;
          }
          img {
            width: auto;
            height: 80px;
          }
        }
        .right {
          .details {
            color: #888;
            font-size: 20px;
            margin-top: 10px;
          }
        }
      }
    }
    .video {
      padding: 0 28px;
      .video-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 75px;
        span:first-child {
          font-weight: bold;
        }
        span {
          em {
            font-style: normal;
          }
        }
        .active {
          color: #ff3434;
        }
      }
      ul {
        padding-bottom: 15px;
      }
      li {
        display: flex;
        align-items: center;
        padding: 10px 0;
        .cover {
          width: 230px;
          height: 130px;
          flex-shrink: 0;
          border-radius: 8px;
          background: no-repeat center center / cover;
          position: relative;
          margin-right: 20px;
          span {
            color: #fff;
            width: 100%;
            text-align: right;
            background: linear-gradient(rgba(0, 0, 0, 0.5), transparent);
            position: absolute;
            top: 0;
            right: 0;
            padding: 6px 10px;
            border-radius: 8px;
            font-size: 15px;
          }
        }
        .info {
          .name {

          }
          .date {
            color: #666;
            font-size: 15px;
          }
        }
      }
    }
  }
  .tr-mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1;
  }
}
</style>