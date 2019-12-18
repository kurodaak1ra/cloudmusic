<template>
  <div class="simple-win">
    <div class="bg-6" @click="simpleHide()"></div>
    <!-- 音质选择（播放页） -->
    <div v-if="getWindows('simple') === 'sound-quality'" class="sound-quality">
      <div class="inner">
        <p>选择在线播放音质</p>
        <ul class="list">
          <li v-if="false" class="auto">
            <span>自动选择</span>
            <span>&#xe634;</span>
          </li>
          <li v-if="getMusicList().quality.l !== null" class="l" @click="l()">
            <span>标准</span>
            <span v-if="getGLOBAL('audio').level === 'standard'" :style="{ color: '#dd4137' }">&#xe634;</span>
          </li>
          <li v-if="getMusicList().quality.m !== null" class="m" @click="m()">
            <span>较高 </span>
            <span v-if="getGLOBAL('audio').level === 'higher'" :style="{ color: '#dd4137' }">&#xe634;</span>
          </li>
          <li v-if="getMusicList().quality.h !== null" class="h" @click="h()">
            <span>极高</span>
            <span v-if="getGLOBAL('audio').level === 'exhigh'" :style="{ color: '#dd4137' }">&#xe634;</span>
          </li>
        </ul>
      </div>
    </div>
    <!-- 清空列表二次确认弹窗（歌曲列表上拉窗） -->
    <div v-else-if="getWindows('simple') === 'list-clear-confirm'" class="list-clear-confirm">
      <div class="inner">
        <p>确定要清空播放列表？</p>
        <div>
          <span @click="simpleHide()">取消</span>
          <span @click="listClearConfirm()">清空</span>
        </div>
      </div>
    </div>
    <!-- 搜索历史记录清空二次确认弹窗 -->
    <div v-else-if="getWindows('simple') === 'search-history-clear-confirm'" class="search-history-clear-confirm">
      <div class="inner">
        <p>确定清空全部历史记录？</p>
        <div>
          <span @click="simpleHide()">取消</span>
          <span @click="searchHistoryClearConfirm()">清空</span>
        </div>
      </div>
    </div>
    <!-- 多歌手转跳弹窗 -->
    <div v-else-if="getWindows('simple') === 'over-one-artist'" class="over-one-artist">
      <div class="inner">
        <p>选择要查看的歌手</p>
        <div v-for="(i, index) in getGLOBAL('simple').multipleArtist" :key="index" @click="goArtist(i.id)">
          <div class="avatar" :style="{ backgroundImage: `url(${i.pic}?imageView=1&thumbnail=35x0)` }"></div>
          <p class="name">{{i.name}}</p>
        </div>
      </div>
    </div>
    <!-- 无版权 -->
    <div v-else-if="getWindows('simple') === 'no-copyright'" class="no-copyright">
      <div class="inner">
        <img src="../../assets/img/no-copyright.png" alt="">
        <div>
          <p>因合作方要求，该资源暂时无法收听，我们在努力争取歌曲回归</p>
        </div>
      </div>
    </div>
    <!-- 新建歌单 -->
    <div v-else-if="getWindows('simple') === 'creat-playlist'" class="creat-playlist">
      <div class="inner">
        <p>新建歌单</p>
        <div class="input">
          <input ref="input" v-model="creatPlaylist.name" type="text" placeholder="请输入歌单标题" maxlength="40" autofocus="autofocus">
          <span v-if="creatPlaylist.name !== ''" @click="creatPlaylist.name = '';$refs.input.focus()">&#xe62b;</span>
        </div>
        <div class="checkbox">
          <div>
            <input id="checkbox" type="checkbox" :checked="creatPlaylist.checked">
            <label for="checkbox">设置为隐私歌单</label>
          </div>
          <span>{{creatPlaylist.name.length}}/40</span>
        </div>
        <div class="submit">
          <span @click="simpleHide()">取消</span>
          <span :style="{ color: creatPlaylist.name === '' ? 'rgba(255, 51, 51, 0.6)' : '#ff3333' }" @click="creatPlaylistConfirm()">提交</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { batchApi } from '../../utils/api'
import { mapMutations, mapActions } from 'vuex'
import { getGLOBAL, getWindows, getMusicList } from '../../utils/store'
import { goArtist } from '../../utils/function'

export default {
  name: 'simple-win',
  data() {
    return {
      // 方法
      getGLOBAL,
      getWindows,
      getMusicList,
      // 数据
      creatPlaylist: {
        name: '',
        checked: false
      },
      commentsShare: ''
    }
  },
  created() {
    if (getWindows('simple') === 'over-one-artist') this.artistListPic()
  },
  methods: {
    ...mapMutations([
      'SET_GLOBAL',
      'SET_WINDOWS',
      'SET_PAGE_DATA',
      'SET_MULTIPLE_ARTIST_PIC_URL'
    ]),
    ...mapActions([
      'HIDE_WIN'
    ]),

    // 关闭弹窗
    simpleHide() {
      this.SET_WINDOWS(['simple', null])
    },

    // 音质切换
    l() {
      this.simpleHide()
      if (getGLOBAL('audio').level === 'standard') return
      this.SET_PAGE_DATA(['trigger', 'level', 'standard'])
    },
    m() {
      this.simpleHide()
      if (getGLOBAL('audio').level === 'higher') return
      this.SET_PAGE_DATA(['trigger', 'level', 'higher'])
    },
    h() {
      this.simpleHide()
      if (getGLOBAL('audio').level === 'exhigh') return
      this.SET_PAGE_DATA(['trigger', 'level', 'exhigh'])
    },

    // 清空列表
    listClearConfirm() {
      this.SET_PAGE_DATA(['audio', 'isPlaying', false])
      this.SET_GLOBAL(['playIndex', null])
      this.SET_GLOBAL(['playingId', null])
      this.SET_GLOBAL(['musicList', []])
      this.SET_GLOBAL(['musicListIds', []])
      if (/player/i.test(this.$route.path)) {
        this.HIDE_WIN()
        this.$router.go(-1)
      }
    },

    // 清空历史记录
    searchHistoryClearConfirm() {
      this.simpleHide()
      this.SET_PAGE_DATA(['search', 'history', []])
    },

    // 多艺术家弹窗
    artistListPic() {
      let data = ['artist-detail-v4']
      let artistArr = getGLOBAL('simple').multipleArtist
      for (let i = 0; i < artistArr.length; i++) {
        batchApi({
          batch: data.toString(),
          arid: artistArr[i].id
        }).then(succ => {
          console.log('获取艺术家图片（success）：', succ)
          this.SET_MULTIPLE_ARTIST_PIC_URL([i, succ['/api/artist/detail/v4'].artist.picUrl])
        }).catch(err => {
          console.warn('获取艺术家图片（error）：', err)
        })
      }
    },
    goArtist(id) {
      this.simpleHide()
      goArtist(id)
    }
  }
}
</script>

<style lang="scss">
.simple-win {
  width: 100%;
  height: 100%;
  display: table;
  position: absolute;
  z-index: 11;
  .bg-6 {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    z-index: -1;
    background: rgba(0, 0, 0, 0.6);
  }
  >div {
    display: table-cell;
    vertical-align: middle;
    .inner {
      background: #fff;
      border-radius: 15px;
    }
  }
  // 音质切换
  .sound-quality {
    padding: 0 50px;
    .inner {
      padding: 40px;
      p {
        font-size: 30px;
        font-weight: bold;
      }
      .list {
        li {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 25px;
          span {
            span {
              color: #dd4137;
              font-size: 35px;
              vertical-align: middle;
            }
          }
        }
      }
    }
  }
  // 列表清空、历史记录
  .list-clear-confirm, .search-history-clear-confirm {
    padding: 0 50px;
    .inner {
      padding: 40px 35px;
      p {
        color: #999;
      }
      div {
        color: #ff3333;
        margin-top: 60px;
        text-align: right;
        span:last-child {
          margin-left: 80px;
        }
      }
    }
  }
  // 多歌手转跳弹窗
  .over-one-artist {
    padding: 0 25px;
    .inner {
      padding: 35px;
      >p {
        font-size: 30px;
        font-weight: bold;
        margin-bottom: 30px;
      }
      div {
        display: flex;
        align-items: center;
        padding: 10px 0;
        .avatar {
          width: 70px;
          height: 70px;
          margin-right: 30px;
          border-radius: 10px;
          background: no-repeat center center / cover;
        }
      }
    }
  }
  // 无版权
  .no-copyright {
    padding: 0 65px;
    .inner {
      div {
        padding: 50px 40px;
        font-size: 27px;
      }
    }
  }
  // 新建歌单
  .creat-playlist {
    padding: 45px;
    .inner {
      padding: 35px;
      >p {
        font-size: 30px;
        font-weight: bold;
        margin-bottom: 30px;
      }
      .input {
        height: 70px;
        border-bottom: 1.5px solid rgba(0, 0, 0, 0.25);
        display: flex;
        align-items: center;
        justify-content: space-between;
        input {
          font-size: 25px;
        }
        input::-webkit-input-placeholder {
          color: rgba(0, 0, 0, 0.25);
        }
        input:-moz-placeholder {
          color: rgba(0, 0, 0, 0.25);
        }
        input::-moz-placeholder {
          color: #c8c8c8;
        }
        input:-ms-input-placeholder {
          color: rgba(0, 0, 0, 0.25);
        }
        span {
          color: rgba(0, 0, 0, 0.25);
          font-size: 23px;
          margin-left: 1em;
        }
      }
      .checkbox {
        color: #606060;
        width: 100%;
        display: table;
        margin-top: 20px;
        div {
          display: table-cell;
          vertical-align: middle;
          input[type="checkbox"] {
            display: none;
          }
          input[type="checkbox"]:checked + label {
            background: url('../../assets/img/window/simple/checkbox.svg') no-repeat bottom left / 1em auto;
          }
          label {
            padding-left: 1.4em;
            background: url('../../assets/img/window/simple/checkbox.svg') no-repeat top left / 1em auto;
          }
        }
        span {
          color: rgba(0, 0, 0, 0.25);
          display: table-cell;
          text-align: right;
          vertical-align: middle;
          font-size: 22px;
        }
      }
      .submit {
        color: #ff3333;
        margin-top: 60px;
        text-align: right;
        span:last-child {
          margin-left: 80px;
        }
      }
    }
  }
}
</style>
