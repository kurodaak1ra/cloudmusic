<template>
  <div class="list-win">
    <div class="title">
      <div class="left" @click="loop()">
        <span v-html="getGLOBAL('audio').loopType === 0 ? '&#xe67f;' : getGLOBAL('audio').loopType === 1 ? '&#xe680;' : getGLOBAL('audio').loopType === 2 ? '&#xe682;' : ''"></span>
        <span v-html="getGLOBAL('audio').loopType === 0 ? '顺序播放' : getGLOBAL('audio').loopType === 1 ? '随机播放' : getGLOBAL('audio').loopType === 2 ? '单曲循环' : ''">随机播放({{getGLOBAL('musicList').length}})</span>
        <span>({{getGLOBAL('musicList').length}})</span>
      </div>
      <div class="right">
        <span>&#xe626;</span>
        <span>收藏全部</span>
        <span @click="$rmask();SET_WINDOWS(['simple', 'list-clear-confirm'])">&#xe625;</span>
      </div>
    </div>
    <div ref="list" class="list-container">
      <ul class="list">
        <li v-for="(i, index) in getGLOBAL('musicList')" :key="index" ref="listId">
          <div class="left" :style="{ color: index === getGLOBAL('playIndex') ? '#ff3a3a' : '#333' }" @click="goPlay(index)">
            <span v-if="index === getGLOBAL('playIndex')">&#xe688;</span>
            <p class="one-line-ellipsis">
              <span>{{i.song.name}}</span>
              <span>{{i.alia.length === 0 ? '' : `（${i.alia.toString().replace(/,/g, '/')}）`}}</span>
              <span :style="{ color: index === getGLOBAL('playIndex') ? '#ff3a3a' : '#616161' }"> - <template v-for="(j, jndex) in i.artist">{{j.name + (i.artist.length - 1 === jndex ? '' : '/')}}</template></span>
            </p>
          </div>
          <div class="right">
            <span v-if="index === getGLOBAL('playIndex')" @click="goSource(index)">&#xe62a;</span>
            <span @click="del(index)">&#xe62b;</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { getGLOBAL, getMusicList } from '../../utils/store'
import { goPlay, goArtist, goAlbum, goPlaylist } from '../../utils/function'

export default {
  name: 'list-win',
  data() {
    return {
      // 方法
      getGLOBAL,
    }
  },
  created() {
    this.$mask()
  },
  mounted() {
    this.scrollTo(getGLOBAL('playIndex'))
  },
  methods: {
    ...mapMutations([
      'SET_GLOBAL',
      'SET_WINDOWS',
      'SET_PAGE_DATA'
    ]),

    // 当前播放歌曲滑动到上拉窗顶部
    scrollTo(index) {
      this.$refs.list.scrollTo(0, this.$refs.listId[0].offsetHeight * index)
    },

    // 当前点击歌曲播放
    goPlay(index) {
      if (index === getGLOBAL('playIndex')) return
      this.$rmask()
      goPlay(getMusicList(index).song.id, null, null, null, 'info')
    },

    // 循环
    loop() {
      this.SET_PAGE_DATA(['audio', 'loopType', getGLOBAL('audio').loopType + 1])
      if (getGLOBAL('audio').loopType > 2) this.SET_PAGE_DATA(['audio', 'loopType', 0])
    },

    // 移除歌曲
    del(index) {
      let tempMusicList = getGLOBAL('musicList')
      let tempMusicListIds = getGLOBAL('musicListIds')
      tempMusicList.splice(index, 1)
      tempMusicListIds.splice(index, 1)
      this.SET_GLOBAL(['musicList', tempMusicList])
      if (getGLOBAL('musicList').length === 0 && /player/i.test(this.$route.path)) {
        this.SET_WINDOWS(['list', false])
        this.$router.go(-1)
      }
      if (getGLOBAL('musicList').length === 0) {
        this.SET_PAGE_DATA(['audio', 'isPlaying', false])
        this.SET_GLOBAL(['playIndex', null])
        return
      }
      if (index === getGLOBAL('playIndex')) {
        this.SET_PAGE_DATA(['audio', 'isPlaying', false])
        if (index >= getGLOBAL('musicList').length - 1) {
          this.SET_PAGE_DATA(['trigger', 'songId', getMusicList(0).song.id])
          return
        }
        this.SET_PAGE_DATA(['trigger', 'songId', getMusicList(index).song.id])
      }
    },

    // 歌曲来源
    goSource(index) {
      this.$rmask()
      let id = getMusicList(index).source.id
      let from = getMusicList(index).source.from
      if (from === 'playlist' && this.$route.path !== '/playlist') {
        goPlaylist(id)
      } else if (from === 'album' && this.$route.path !== '/album') {
        goAlbum(id)
      } else if (from === 'artist' && this.$route.path !== '/artist') {
        goArtist(id)
      } else if (from === 'banner') {
        this.$toast('来自：Banner广告位')
      } else if (from === 'search') {
        this.$toast('来自：搜索')
      }
    }
  }
}
</script>

<style lang="scss">
.list-win {
  width: 100%;
  height: 60%;
  background: #fff;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 11;
  .title {
    width: 100%;
    height: 90px;
    padding: 0 20px;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    justify-content: space-between;
    .left {
      height: 100%;
      display: flex;
      align-items: center;
      span:first-child {
        margin-right: 15px;
        font-size: 30px;
      }
    }
    .right {
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 30px;
      span:nth-child(2) {
        font-size: 25px;
        margin: 0 25px 0 10px;
      }
      span:last-child {
        padding-left: 15px;
        border-left: 1.5px solid #f5f5f5;
      }
    }
  }
  .list-container {
    overflow: auto;
    position: absolute;
    top: 90px;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 0 18px;
    .list {
      li {
        height: 80px;
        display: flex;
        justify-content: space-between;
        div {
          display: flex;
          align-items: center;
        }
        .left {
          width: 100%;
          overflow: hidden;
          >span {
            font-size: 30px;
            margin-right: 10px;
          }
          p {
            span:last-child {
              color: #616161;
              font-size: 20px;
            }
          }
        }
        .right {
          color: #616161;
          span {
            margin-left: 40px;
          }
        }
      }
      li:last-child {
        border-bottom: none;
      }
    }
  }
}
</style>