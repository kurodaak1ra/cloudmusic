<template>
  <scroll ref="scroll" class="found-page web-page" :up="getScrollUp()">
    <swiper ref="mySwiper" class="banner-swiper" :options="swiperOption()">
      <swiper-slide v-for="(i, index) in banner" :key="index">
        <a v-if="/3000|1000/.test(i.type)" :href="i.url" target="_blank"></a>
        <i v-else @click="bannerTarget(i.type, i.id)"></i>
        <div :style="{ backgroundImage: `url(${i.pic}?imageView=1&thumbnail=695x0)` }"></div>
        <span :style="{ background: i.color === 'blue' ? '#489ad0' : '#e63435' }">{{i.title}}</span>
      </swiper-slide>
      <div slot="pagination" class="swiper-pagination"></div>
    </swiper>
    <div class="nav-bar">
      <div>
        <div>
          <img src="../../assets/img/found/01.svg" alt="">
          <span class="date">{{new Date().getDate()}}</span>
        </div>
        <p>每日推荐</p>
      </div>
      <div>
        <div>
          <img src="../../assets/img/found/02.svg" alt="">
        </div>
        <p>歌单</p>
      </div>
      <div>
        <div>
          <img src="../../assets/img/found/03.svg" alt="">
        </div>
        <p>排行榜</p>
      </div>
      <div>
        <div>
          <img src="../../assets/img/found/04.svg" alt="">
        </div>
        <p>电台</p>
      </div>
      <div>
        <div>
          <img src="../../assets/img/found/05.svg" alt="">
        </div>
        <p>直播</p>
      </div>
    </div>
    <!-- 推荐歌单 -->
    <div v-if="osusumeMusic.length !== 0" class="osusume-music">
      <div class="title">
        <p>推荐歌单</p>
        <p @click="playlistSquare()">歌单广场</p>
      </div>
      <ul class="list">
        <li v-for="(i, index) in osusumeMusic" :key="index" @click="goPlaylist(i.id, i.name, i.copywriter)">
          <div class="cover" :style="{ backgroundImage: `url(${i.cover})` }"></div>
          <span>&#xe667;{{formatCount(i.playCount)}}</span>
          <p class="two-line-ellipsis">{{i.name}}</p>
        </li>
      </ul>
    </div>
    <!-- 新碟、新歌 -->
    <div v-if="newSongAlbum.length !== 0" class="new-song-album">
      <div class="title">
        <p>新碟<span>｜</span><span>新歌</span></p>
        <p @click="moreNewSongAlbum()">更多新碟</p>
      </div>
      <div class="list">
        <li v-for="(i, index) in newSongAlbum" :key="index">
          <a v-if="i.go !== null" :href="i.go" target="_blank"></a>
          <i v-else @click="goAlbum(i.id, i.name, i.copywriter)"></i>
          <div class="cover">
            <img v-if="index === 0" src="../../assets/img/found/digital-album-cover.svg" alt="">
            <div :style="{ backgroundImage: `url(${i.pic})` }"></div>
          </div>
          <p class="name one-line-ellipsis">{{i.name}}</p>
          <p class="artist one-line-ellipsis"><template v-for="(j, jndex) in i.artists">{{j.name}}{{jndex === i.artists.length - 1 ? '' : '/'}}</template></p>
        </li>
      </div>
    </div>
  </scroll>
</template>

<script>
import scroll from '../plugins/scroll'
import { mapMutations } from 'vuex'
import { getGLOBAL } from '../../utils/store'
import { goAlbum, goPlaylist } from '../../utils/function'
import { batchApi, songDetailApi } from '../../utils/api'
import { imgToBlob, formatCount, projectMainCoreData } from '../../utils/tools'

export default {
  name: 'found',
  components: { scroll },
  data() {
    return {
      // 方法
      formatCount,
      getGLOBAL,
      goAlbum,
      goPlaylist,
      // 数据
      banner: [],
      osusumeMusic: [],
      newSongAlbum: [],
      reqEnd: true
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
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
        downRefresh: {
          reqEnd: this.reqEnd,
          tips: '已为你推荐新的个性化内容',
          callback: () => {
            this.getBanner()
            this.getOsusume()
          }
        },
        callback: () => {
          this.getBanner()
          this.getOsusume()
        }
      }
    },

    // swiper
    swiperOption() {
      return {
        loop: false,
        autoplay: {
          delay: 5000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        observer: true,
        observeParents: true,
        pagination: {
          el: '.swiper-pagination'
        }
      }
    },

    // 获取 banner
    getBanner() {
      let data = ['banner-get-v3', 'personalized-block-old-v2']
      batchApi({
        batch: data.toString()
      }).then(succ => {
        console.log('获取banner、新歌新碟（success）：', succ)
        // banner、新歌新碟 重置
        this.banner = []
        this.newSongAlbum = []
        this.swiper.slideTo(0, 0)
        // banner
        for (let i = 0; i < succ['/api/banner/get/v3'].banners.length; i++) {
          this.banner.push({
            id: succ['/api/banner/get/v3'].banners[i].targetId,
            pic: succ['/api/banner/get/v3'].banners[i].pic,
            url: succ['/api/banner/get/v3'].banners[i].url,
            type: succ['/api/banner/get/v3'].banners[i].targetType,
            video: succ['/api/banner/get/v3'].banners[i].video,
            title: succ['/api/banner/get/v3'].banners[i].typeTitle,
            color: succ['/api/banner/get/v3'].banners[i].titleColor,
          })
        }
        // 分割线
        if (succ['/api/personalized/block/old/v2'].data.length < 2) return
        // 新碟新歌
        this.newSongAlbum.push({
          id: null,
          go: succ['/api/personalized/block/old/v2'].data[1].oldBlock.digitalAlbumEntrance.towardURL,
          pic: getGLOBAL('1px')['eeeeee'],
          name: succ['/api/personalized/block/old/v2'].data[1].oldBlock.digitalAlbumEntrance.subTitle,
          copywriter: ''
        })
        imgToBlob(succ['/api/personalized/block/old/v2'].data[1].oldBlock.digitalAlbumEntrance.coverURL + '?imageView=1&thumbnail=220x0', blur => { this.newSongAlbum[0].pic = blur }, 20, 0)
        for (let i = 0; i < succ['/api/personalized/block/old/v2'].data[1].oldBlock.newAlbum.length; i++) {
          this.newSongAlbum.push({
            go: null,
            id: succ['/api/personalized/block/old/v2'].data[1].oldBlock.newAlbum[i].id,
            pic: succ['/api/personalized/block/old/v2'].data[1].oldBlock.newAlbum[i].picUrl + '?imageView=1&thumbnail=220x0',
            name: succ['/api/personalized/block/old/v2'].data[1].oldBlock.newAlbum[i].name,
            type: succ['/api/personalized/block/old/v2'].data[1].oldBlock.newAlbum[i].type,
            artists: succ['/api/personalized/block/old/v2'].data[1].oldBlock.newAlbum[i].artists,
            copywriter: succ['/api/personalized/block/old/v2'].data[1].oldBlock.newAlbum[i].copywriter,
            artistName: succ['/api/personalized/block/old/v2'].data[1].oldBlock.newAlbum[i].artistName
          })
        }
        // 加载结束
        this.$refs.scroll.upEndSucc({ more: false })
      }).catch(err => {
        console.warn('获取banner、新歌新碟（error）：', err)
        this.$refs.scroll.upEndErr()
      })
    },

    // 获取推荐歌单
    getOsusume() {
      this.reqEnd = false
      batchApi({
        batch: 'personalized-block-old-v2'
      }).then(succ => {
        console.log('获取推荐歌单（success）：', succ)
        let list = succ['/api/personalized/block/old/v2'].data[0].oldBlock.result
        for (let i = 0; i < list.length; i++) list[i]['cover'] = getGLOBAL('1px')['eeeeee']
        this.osusumeMusic = list
        for (let i = 0; i < list.length; i++) imgToBlob(`${list[i].picUrl}?imageView=1&thumbnail=220x0`, res => { this.osusumeMusic[i].cover = res })
        // 加载结束
        this.$refs.scroll.upEndSucc({ more: false })
        // 下拉刷新
        this.reqEnd = true
      }).catch(err => {
        console.warn('获取推荐歌单（error）：', err)
        this.$refs.scroll.upEndErr()
        // 下拉刷新
        this.reqEnd = true
      })
    },

    // 歌单广场
    playlistSquare() {
      this.$toast('没做')
    },

    // 更多新碟新歌
    moreNewSongAlbum() {
      this.$toast('没做')
    },

    /**
     * banner 转跳
     * 1. 歌曲
     * 10. 专辑
     * 1004. 视频
     */
    bannerTarget(type, id) {
      if (type === 1) {
        // 获取歌曲详情
        songDetailApi({
          ids: id
        }).then(succ => {
          console.log('获取歌曲详情（success）：', succ)
          // 无法播放直接跳过
          if (succ.privileges[0].pl === 0) {
            this.SET_WINDOWS(['simple', 'no-copyright'])
            return
          }

          let tempMusicList = getGLOBAL('musicList')
          let tempMusicListIds = getGLOBAL('musicListIds')
          let tempPlayIndex = getGLOBAL('playIndex') === null ? 0 : getGLOBAL('playIndex')
          let exist = tempMusicListIds.indexOf(id)
          if (exist !== -1) tempMusicList.splice(exist, 1)

          let tempArtist = []
          for (let i = 0; i < succ.songs[0].ar.length; i++) {
            tempArtist.push({
              id: succ.songs[0].ar[i].id,
              name: succ.songs[0].ar[i].name,
              pic: getGLOBAL('1px')['eeeeee']
            })
          }

          // 主数据
          tempMusicListIds.splice(tempPlayIndex + 1, 0, succ.songs[0].id)
          tempMusicList.splice(tempPlayIndex + 1, 0, projectMainCoreData(
            succ.songs[0],
            {
              id: null,
              name: 'Banner推荐',
              from: 'banner'
            }
          ))
          // 更新列表数组
          this.SET_GLOBAL(['musicList', tempMusicList])
          this.SET_GLOBAL(['musicListIds', tempMusicListIds])
          this.SET_PAGE_DATA(['trigger', 'songId', id])
        }).catch(err => {
          console.warn('获取歌曲详情（error）：', err)
        })
      } else if (type === 10) {
        this.SET_PAGE_DATA(['album', 'id', id])
        this.$router.push({ path: '/album' })
      } else if (type === 1004) {
        console.log('视频')
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'slogan') return next(false)
    next()
  }
}
</script>

<style lang="scss">
.found-page {
  padding-top: 20px;
  .swiper-container {
    height: 265px;
    box-sizing: content-box;
    .swiper-slide {
      position: relative;
      padding: 0 28px;
      a, i {
        display: block;
        position: absolute;
        top: 0;
        left: 28px;
        right: 28px;
        bottom: 0;
      }
      div {
        width: 100%;
        height: 265px;
        border-radius: 10px;
        background: no-repeat center center / cover;
      }
      span {
        color: #fff;
        position: absolute;
        right: 28px;
        bottom: 0;
        line-height: 1em;
        border-top-left-radius: 10px;
        border-bottom-right-radius: 10px;
        font-size: 20px;
        padding: 10px 11px;
        text-align: center;
      }
    }
    .swiper-pagination {
      bottom: 15px;
      span {
        width: 12px;
        height: 12px;
        background: rgba(0, 0, 0, 0.3);
      }
      .swiper-pagination-bullet-active {
        opacity: 0.8;
        background: #db2c1f !important;
      }
    }
  }
  .nav-bar {
    text-align: center;
    padding: 35px 45px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1PX solid #f4f4f4;
    div {
      font-size: 21px;
      div {
        width: 80px;
        height: 80px;
        position: relative;
        margin-bottom: 15px;
        border-radius: 50%;
        .date {
          color: #ff552f;
          position: absolute;
          left: 0;
          right: 0;
          bottom: 24px;
        }
      }
    }
  }
  .osusume-music {
    margin-top: 40px;
    padding: 0 28px;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: -10px;
      p:first-child {
        font-weight: bold;
        font-size: 30px;
      }
      p:last-child {
        width: 120px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        border: 1.5px solid rgba(0, 0, 0, 0.1);
        border-radius: 50PX;
        font-size: 20px;
      }
    }
    .list {
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      li {
        width: 220px;
        position: relative;
        margin-top: 40px;
        font-size: 21px;
        .cover {
          width: 220px;
          height: 220px;
          border-radius: 8px;
          background: no-repeat center center / cover;
          transition: background-image .4s;
        }
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
        }
        p {
          margin-top: 15px;
        }
      }
    }
  }
  .new-song-album {
    margin-top: 70px;
    padding: 0 28px 40px;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: -10px;
      p:first-child {
        font-weight: bold;
        font-size: 30px;
        span:first-child {
          color: #ececec;
        }
        span:last-child {
          color: #808080;
          font-size: 22px;
        }
      }
      p:last-child {
        width: 120px;
        height: 44px;
        line-height: 44px;
        text-align: center;
        border: 1.5px solid rgba(0, 0, 0, 0.1);
        border-radius: 50PX;
        font-size: 20px;
      }
    }
    .list {
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      li {
        width: 220px;
        position: relative;
        margin-top: 40px;
        font-size: 21px;
        a, i {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
        }
        .cover {
          overflow: hidden;
          border-radius: 8px;
          position: relative;
          img {
            position: absolute;
          }
          div {
            width: 220px;
            height: 220px;
            transition: background-image .4s;
            background: no-repeat center center / cover;
          }
        }
        .name {
          margin-top: 15px;
        }
        .artist {
          color: #808080;
          font-size: 20px;
        }
      }
    }
  }
}
</style>
