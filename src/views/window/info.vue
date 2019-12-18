<template>
  <div class="info-win">
    <div class="title">
      <div class="cover" :style="{ backgroundImage: `url(${data.album.blob})` }"></div>
      <div class="info">
        <p class="name two-line-ellipsis">歌曲：{{data.song.name + (data.alia.length === 0 ? '' : `（${data.alia})`)}}</p>
        <p class="artist"><template v-for="(i, index) in data.artist">{{i.name + (data.artist.length - 1 === index ? '' : '/')}}</template></p>
      </div>
    </div>
    <ul class="list">
      <li v-if="$route.path !== '/player'">
        <span>&#xe65b;</span>
        <p>下一首播放</p>
      </li>
      <!--  -->
      <li>
        <span>&#xe626;</span>
        <p>收藏到歌单</p>
      </li>
      <!--  -->
      <li v-if="$route.path !== '/player'" @click="goComments()">
        <span>&#xe675;</span>
        <p>评论({{comments}})</p>
      </li>
      <li v-if="$route.path !== '/player'" ref="share" @click="share()">
        <span>&#xe674;</span>
        <p>分享</p>
      </li>
      <!--  -->
      <li @click="goArtist()">
        <span>&#xe62e;</span>
        <p>歌手：<template v-for="(i, index) in data.artist">{{i.name + (data.artist.length - 1 === index ? '' : '/')}}</template></p>
      </li>
      <li v-if="$route.path !== '/album'" @click="goAlbum()">
        <span>&#xe630;</span>
        <p>专辑：{{data.album.name}}</p>
      </li>
      <!--  -->
      <li v-if="$route.path === '/player'" @click="goSource()">
        <span>&#xe631;</span>
        <p>来源：{{getMusicList().source.name}}</p>
      </li>
      <li v-if="$route.path === '/player'" @click="qualityWin()">
        <span>&#xe62f;</span>
        <p>音质：{{getGLOBAL('audio').codeRate / 1000 + 'kbit/s'}}</p>
      </li>
      <!--  -->
      <li>
        <span>&#xe609;</span>
        <p>查看视频</p>
      </li>
      <!--  -->
      <li v-if="$route.path === '/player'">
        <span>&#xe632;</span>
        <p>相似推荐</p>
      </li>
      <li v-if="$route.path === '/player'">
        <span>&#xe62c;</span>
        <p>定时停止播放</p>
      </li>
      <li>
        <span>&#xe62d;</span>
        <p>打开驾驶模式</p>
      </li>
    </ul>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import { mapMutations } from 'vuex'
import { imgToBlob } from '../../utils/tools'
import { getGLOBAL, getMusicList } from '../../utils/store'
import { batchApi, songDetailApi } from '../../utils/api'
import { goArtist, goComments, goAlbum, goPlaylist } from '../../utils/function'

export default {
  name: 'info-win',
  data() {
    return {
      // 方法
      getGLOBAL,
      getMusicList,
      // 数据
      pShow: true,
      comments: 0,
      data: {
        alia: [],
        song: {},
        album: {
          blob: getGLOBAL('1px')['eeeeee']
        },
        artist: []
      }
    }
  },
  created() {
    this.$mask()
    this.init()
  },
  mounted() {
    // 分享
    if (this.$route.path === '/player') return
    this.clipboard = new Clipboard(this.$refs.share, {
      text: () => {
        let tempArtist = []
        for (let i = 0; i < this.data.artist.length; i++) {
          tempArtist.push(this.data.artist[i].name)
        }
        if (getGLOBAL('isLogin')) {
          return `分享${tempArtist.toString().replace(/,/g, '/')}的单曲《${this.data.song.name + (this.data.alia.length === 0 ? '' : `（${this.data.alia.toString().replace(/,/g, '/')}）`)}》: http://music.163.com/song/${this.data.song.is}/?userid=${getGLOBAL('userInfo').uid} (来自@网易云音乐 Write by KA)`
        } else {
          return `分享${tempArtist.toString().replace(/,/g, '/')}的单曲《${this.data.song.name + (this.data.alia.length === 0 ? '' : `（${this.data.alia.toString().replace(/,/g, '/')}）`)}》: http://music.163.com/song/${this.data.song.id} (来自@网易云音乐 Write by KA)`
        }
      }
    })
  },
  methods: {
    ...mapMutations([
      'SET_WINDOWS',
      'SET_PAGE_DATA'
    ]),

    init() {
      // 获取 comment info
      batchApi({
        mid: getGLOBAL('info').id,
        batch: 'resource-commentInfo-list'
      }).then(succ => {
        console.log('信息上拉窗获取comment info（success）：', succ)
        this.comments = succ['/api/resource/commentInfo/list'].data[0].commentCount
      }).catch(err => {
        console.warn('信息上拉窗获取comment info（error）：', err)
      })
      // 获取歌曲详细信息
      songDetailApi({
        ids: getGLOBAL('info').id
      }).then(succ => {
        console.log('歌曲信息上拉窗获取歌曲信息（success）：', succ)
        // 艺术家信息
        let tempArtist = []
        for (let i = 0; i < succ.songs[0].ar.length; i++) {
          tempArtist.push({
            id: succ.songs[0].ar[i].id,
            name: succ.songs[0].ar[i].name,
            pic: getGLOBAL('1px')['eeeeee']
          })
        }
        // 页面信息
        this.data = {
          alia: succ.songs[0].alia.toString().replace(/,/g, '/'),
          song: {
            id: succ.songs[0].id,
            name: succ.songs[0].name
          },
          album: {
            id: succ.songs[0].al.id,
            name: succ.songs[0].al.name,
            pic: succ.songs[0].al.picUrl,
            blob: getGLOBAL('1px')['eeeeee']
          },
          artist: tempArtist
        }
        // cover
        imgToBlob(succ.songs[0].al.picUrl + '?imageView=1&thumbnail=45x0', res => { this.data.album.blob = res })
      }).catch(err => {
        console.warn('歌曲信息上拉窗获取歌曲信息（error）：', err)
      })
    },

    // 音质弹窗
    qualityWin() {
      this.$rmask()
      this.SET_WINDOWS(['simple', 'sound-quality'])
    },

    // 艺术家
    goArtist() {
      this.$rmask()
      goArtist(this.data.artist)
    },

    // 专辑
    goAlbum() {
      this.$rmask()
      goAlbum(this.data.album.id, this.data.album.name)
    },

    // 来源
    goSource() {
      this.$rmask()
      let id = getMusicList().source.id
      let from = getMusicList().source.from
      if (from === 'playlist' && this.$route.path !== '/playlist') {
        goPlaylist(id, '')
      } else if (from === 'album' && this.$route.path !== '/album') {
        goAlbum(id)
      } else if (from === 'artist' && this.$route.path !== '/artist') {
        goArtist(id)
      } else if (from === 'banner') {
        this.$toast('来自：Banner广告位')
      } else if (from === 'search') {
        this.$toast('来自：搜索')
      }
    },

    // 评论
    goComments() {
      let tempArtist = []
      for (let i = 0; i < this.data.artist.length; i++) {
        tempArtist.push(this.data.artist[i].name)
      }
      this.$rmask()
      imgToBlob(this.data.album.pic + '?imageView=1&thumbnail=190x0', res => {
        goComments(
          0,
          this.data.song.id,
          this.data.artist,
          this.data.song.name,
          tempArtist.toString().replace(/,/g, '/'),
          res
        )
      })
    },

    // 分享
    share(ev) {
      this.clipboard.on('success', e => {
        this.$toast('分享链接复制成功')
      })
      this.clipboard.on('error', e => {
        this.$toast('浏览器不支持自动复制')
      })
    }
  }
}
</script>

<style lang="scss">
.info-win {
  width: 100%;
  height: 60%;
  background: #fff;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 11;
  overflow-x: hidden;
  overflow-y: auto;
  .title {
    height: 90px;
    padding: 28px;
    display: flex;
    align-items: center;
    box-sizing: content-box;
    border-bottom: 1.5px solid #f3f3f3;
    .cover {
      width: 90px;
      height: 100%;
      border-radius: 6px;
      margin-right: 20px;
      background: no-repeat center center / cover;
      transition: background-image .4s;
      flex-shrink: 0;
    }
    .info {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .name {
        font-size: 26px;
        line-height: 1.5em;
      }
      .artist {
        color: #999;
        font-size: 21px;
        line-height: 1em;
      }
    }
    button {
      color: #dd4137;
      width: 135px;
      height: 50px;
      margin-left: 40px;
      font-size: 20px;
      border: 1PX solid #dd4137;
      border-radius: 50PX;
      flex-shrink: 0;
    }
  }
  .list {
    padding-left: 28px;
    li {
      height: 80px;
      display: flex;
      align-items: center;
      span {
        margin: 0 20px 0 10px;
        font-size: 38px;
        flex-shrink: 0;
      }
      p {
        width: 100%;
        height: 100%;
        font-size: 23px;
        line-height: 80px;
        padding-left: 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        border-top: 1.5px solid #f3f3f3;
      }
    }
    li:first-child {
      p {
        border: none;
      }
    }
  }
}
</style>
