<template>
  <noscript>
    <strong>We're sorry but cloud-music doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
  </noscript>
</template>

<script>
import { mapMutations } from 'vuex'
import { imgToBlob } from '../utils/tools'
import { getGLOBAL, getMusicList } from '../utils/store'
import { songUrlApi, songLyricApi, commentMusicApi } from '../utils/api'

export default {
  name: 'Audio',
  data() {
    return {
      audio: new Audio()
    }
  },
  watch: {
    // 监听 is playing
    '$store.state.GLOBAL.audio.isPlaying'(newer, older) {
      if (this.audio.src === null || getGLOBAL('audio').isLoading) return
      if (newer) {
        this.audio.play()
      } else {
        this.audio.pause()
      }
    },
    // 监听循环
    '$store.state.GLOBAL.audio.loopType'(newer, older) {
      this.audio.loop = newer === 2 ? true : false
    },
    // 监听音量
    '$store.state.GLOBAL.audio.volume'(newer, older) {
      this.audio.volume = newer
    },
    // 监听歌曲切换
    '$store.state.GLOBAL.trigger.songId'(newer, older) {
      this.requestMusic(newer)
    },
    // 监听音质切换
    '$store.state.GLOBAL.trigger.level'(newer, older) {
      this.requestMusic(getGLOBAL('playingId'), newer)
    },
    // 监听时间拖动
    '$store.state.GLOBAL.trigger.process'(newer, older) {
      this.audio.currentTime = newer
    },
    // 监听上一曲
    '$store.state.GLOBAL.trigger.prevPiece'(newer, older) {
      if (getGLOBAL('playIndex') === 0) return
      this.requestMusic(getMusicList(getGLOBAL('playIndex') - 1).song.id)
    },
    // 监听下一曲
    '$store.state.GLOBAL.trigger.nextPiece'(newer, older) {
      if (getGLOBAL('playIndex') === getGLOBAL('musicList').length - 1) return
      this.requestMusic(getMusicList(getGLOBAL('playIndex') + 1).song.id)
    }
  },
  created() {
    this.addEventListener()
  },
  methods: {
    ...mapMutations([
      'SET_GLOBAL',
      'SET_PAGE_DATA',
      'SET_MUSIC_LIST_COVER_BLOB_URL'
    ]),

    // 监听事件
    addEventListener() {
      this.audio.addEventListener('loadstart', () => {
        console.log('<-- 开始请求数据 -->')
        this.SET_PAGE_DATA(['audio', 'isLoading', true])
      })
      this.audio.addEventListener('progress', () => {
        console.log('<-- 请求数据 ing -->')
        let currentBuffered = this.audio.buffered.end(this.audio.buffered.length - 1)
        this.SET_PAGE_DATA(['audio', 'buffered', currentBuffered / (getMusicList().duration / 1000) * 100])
      })
      this.audio.addEventListener('error', () => {
        console.log('<-- 请求失败 -->')
        this.SET_PAGE_DATA(['audio', 'isLoading', false])
        if (!window.navigator.onLine) this.$toast('歌曲请求失败，请检查网络')
      })
      this.audio.addEventListener('stalled', () => {
        console.log('<-- 网络失速 -->')
        this.$toast('网络失速')
      })
      this.audio.addEventListener('waiting', () => {
        console.log('<-- 等待数据 ing -->')
        this.SET_PAGE_DATA(['audio', 'isLoading', true])
      })
      this.audio.addEventListener('canplaythrough', () => {
        console.log('<-- 加载完毕，可以播放 -->')
        if (getGLOBAL('trigger').currentTime !== 0) {
          this.audio.currentTime = getGLOBAL('trigger').currentTime
          this.SET_PAGE_DATA(['trigger', 'currentTime', 0])
        }
        this.SET_PAGE_DATA(['audio', 'isLoading', false])
        this.audio.volume = 0.5
        this.audio.play()
      })
      this.audio.addEventListener('play', () => {
        console.log('<-- 播放 -->')
        this.SET_PAGE_DATA(['audio', 'isPlaying', true])
        this.sendCurrentTime('set')
      })
      this.audio.addEventListener('pause', () => {
        console.log('<-- 暂停 -->')
        this.sendCurrentTime('clear')
      })
      this.audio.addEventListener('ended', () => {
        console.log('<-- 播放结束 -->')
        let nextMusicIndex = null
        let tempLoopType = getGLOBAL('audio').loopType
        if (tempLoopType === 0) {
          if (getGLOBAL('playIndex') === getGLOBAL('musicList').length - 1) {
            this.SET_PAGE_DATA(['audio', 'isPlaying', false])
            this.sendCurrentTime('clear')
            this.SET_PAGE_DATA(['audio', 'currentTime', 0])
            this.SET_PAGE_DATA(['player', 'lyricTarget', 0])
            return
          }
          nextMusicIndex = getGLOBAL('playIndex') + 1
        } else if (tempLoopType === 1) {
          nextMusicIndex = Math.floor(Math.random() * getGLOBAL('musicList').length)
        }
        if (/player/.test(this.$route.path)) {
          this.SET_PAGE_DATA(['trigger', 'autoNext', !getGLOBAL('trigger').autoNext])
        } else {
          this.requestMusic(getMusicList(nextMusicIndex).song.id)
        }
      })
    },

    // 获取歌词
    setLyric(id) {
      songLyricApi({
        id: id
      }).then(succ => {
        console.log('获取歌词（success）：', succ)
        let tempLyricObj = {
          lrc: false,
          tlrc: false,
          lyric: {}
        }
        // const reg = /\[(\d+):(\d+)[.|:](\d+)\](.+)/
        const reg2 = /\[(\d+):(\d+)[.|:](\d+)\]/
        const regTime = /\[(\d+):(\d+)[.|:](\d+)\]/g
        // const regCompatible = /\[(\d+):(\d+)]()(.+)/
        const regCompatible2 = /\[(\d+):(\d+)]()/
        const regTimeCompatible = /\[(\d+):(\d+)]/g
        // 原歌词
        if ('lrc' in succ && succ.lrc.lyric !== null) {
          tempLyricObj['lrc'] = true
          // 请求到的歌词转大数组
          let tempLrc = succ.lrc.lyric.split('\n')
          for (let i = 0; i < tempLrc.length; i++) {
            if (tempLrc[i].length !== 0 && !isNaN(tempLrc[i].substr(1, 2))) {
              // 检测时间轴类型
              let timeLineType = tempLrc[i].match(regTime) === null ? 2 : 3
              // 共享时间轴分割
              let timeLineSplit = timeLineType === 2 ? tempLrc[i].match(regTimeCompatible) : tempLrc[i].match(regTime)
              // 创建歌词 obj
              for (let j = 0; j < timeLineSplit.length; j++) {
                // 歌词文本裁剪成数组
                let tempLrcStrArr = tempLrc[i].split(timeLineSplit[timeLineSplit.length - 1])
                // 裁剪后歌词文本
                let tempLrcStr = tempLrcStrArr[tempLrcStrArr.length - 1].trim()
                // 如歌词为空跳过
                if (tempLrcStr === '') continue
                // 单时间轴时分秒切割
                let timeLineTimeSplit = timeLineType === 2 ? timeLineSplit[j].match(regCompatible2) : timeLineSplit[j].match(reg2)
                // 时间轴转时间戳
                let timeLineToTimestamp = timeLineType === 2 ? parseInt((timeLineTimeSplit[1] * 60) + (timeLineTimeSplit[2] * 1) + '00', 10) : parseInt((timeLineTimeSplit[1] * 60) + (timeLineTimeSplit[2] * 1) + timeLineTimeSplit[3].substr(0, 1), 10)
                // 歌词数组
                tempLyricObj['lyric'][timeLineToTimestamp] = {
                  lrc: tempLrcStr,
                  tlrc: ''
                }
              }
            }
          }
        }
        // 翻译（如果有）
        if ('tlyric' in succ && succ.tlyric.lyric != null) {
          let tempTlrc = succ.tlyric.lyric.split('\n')
          for (let i = 0; i < tempTlrc.length; i++) {
            tempLyricObj['tlrc'] = true
            if (tempTlrc[i].length !== 0 && !isNaN(tempTlrc[i].substr(1, 2))) {
              // 检测时间轴类型
              let timeLineType = tempTlrc[i].match(regTime) === null ? 2 : 3
              // 时间轴分割
              let timeLineSplit = timeLineType === 2 ? tempTlrc[i].match(regTimeCompatible) : tempTlrc[i].match(regTime)
              for (let j = 0; j < timeLineSplit.length; j++) {
                // 歌词文本裁剪成数组
                let tempTlrcStrArr = tempTlrc[i].split(timeLineSplit[timeLineSplit.length - 1])
                // 裁剪后歌词文本
                let tempTlrcStr = tempTlrcStrArr[tempTlrcStrArr.length - 1].trim()
                // 如歌词为空跳过
                if (tempTlrcStr === '') continue
                // 单时间轴按时分秒切割
                let timeLineTimeSplit = timeLineType === 2 ? timeLineSplit[j].match(regCompatible2) : timeLineSplit[j].match(reg2)
                // 时间轴转时间戳
                let timeLineToTimestamp = timeLineType === 2 ? parseInt((timeLineTimeSplit[1] * 60) + (timeLineTimeSplit[2] * 1) + '00', 10) : parseInt((timeLineTimeSplit[1] * 60) + (timeLineTimeSplit[2] * 1) + timeLineTimeSplit[3].substr(0, 1), 10)
                // 追加歌词翻译
                if (timeLineToTimestamp in tempLyricObj['lyric']) {
                  tempLyricObj['lyric'][timeLineToTimestamp]['tlrc'] = tempTlrcStr
                }
              }
            }
          }
        }
        // 歌词贡献者和翻译者
        let lyricUser = 'lyricUser' in succ ? '歌词贡献者：' + succ.lyricUser.nickname : ''
        let transUser = 'transUser' in succ ? '翻译贡献者：' + succ.transUser.nickname : ''
        tempLyricObj['lyric']['author'] = { lrc: lyricUser, tlrc: transUser }
        // 无歌词
        if ('nolyric' in succ && succ.nolyric) tempLyricObj['lyric']['nolyric'] = { lrc: '纯音乐，请欣赏', tlrc: '' }
        // 设置歌词数据
        this.SET_PAGE_DATA(['player', 'lyricList', tempLyricObj])
        // 时间轴数组
        let tempLyricTimeLine = []
        for (let i in tempLyricObj.lyric) {
          if (Object.prototype.hasOwnProperty.call(tempLyricObj.lyric, i)) tempLyricTimeLine.push(parseInt(i, 10))
        }
        this.SET_PAGE_DATA(['player', 'lyricTimeLine', tempLyricTimeLine])
      }).catch(err => {
        console.warn('获取歌词（error）：', err)
      })
    },

    // 实时递送当前播放时长
    sendCurrentTime(type) {
      if (type === 'clear') {
        clearInterval(this.interval)
      } else if (type === 'set') {
        this.interval = setInterval(() => {
          if (getGLOBAL('audio').isLoading) return
          this.SET_PAGE_DATA(['audio', 'currentTime', this.audio.currentTime])
          this.lyricTarget(this.audio.currentTime)
        }, 100)
      }
    },

    // 设定总时长
    setTotalTime() {
      let tempTotalTime = Math.floor(getMusicList().duration / 1000)
      let totalTimeMinute = Math.floor(Math.round(tempTotalTime) / 60) < 10 ? '0' + Math.floor(Math.round(tempTotalTime) / 60) : Math.floor(Math.round(tempTotalTime) / 60)
      let totalTimeSecond = Math.floor(tempTotalTime) % 60 < 10 ? '0' + Math.floor(tempTotalTime) % 60 : Math.floor(tempTotalTime) % 60
      this.SET_PAGE_DATA(['audio', 'totalTime', totalTimeMinute + ':' + totalTimeSecond])
    },

    // 当前歌词位置
    lyricTarget(time) {
      let currentLyricIndex = getGLOBAL('player').lyricTimeLine.indexOf(Math.floor(time * 10))
      if (currentLyricIndex !== -1) {
        this.SET_PAGE_DATA(['player', 'lyricTarget', currentLyricIndex])
        let lyric = getGLOBAL('player').lyricList.lyric[Math.floor(time * 10)]
        console.info('')
        console.info(`%c > ${lyric.lrc} `, 'color:#db2c1f;background:rgba(0,0,0,0.2);font-size:25px;border-radius:6px')
        if (getGLOBAL('player').lyricList.tlrc && lyric.tlrc !== '') console.info(`%c > ${lyric.tlrc} `, 'color:#db2c1f;background:rgba(0,0,0,0.2);font-size:25px;border-radius:6px')
      }
    },

    // 更新 cover swiper 数组
    reloadCoverSwiper(index) {
      let musicCount = getGLOBAL('musicList').length - 1
      let tempMusicList = getGLOBAL('musicList')
      if (index === 0) {
        if (tempMusicList.length <= 1) {
          this.SET_PAGE_DATA(['player', 'coverSwiperList', [tempMusicList[0]]])
        } else {
          this.SET_PAGE_DATA(['player', 'coverSwiperList', [tempMusicList[0], tempMusicList[1]]])
        }
      } else if (index > 0 && index < musicCount) {
        this.SET_PAGE_DATA(['player', 'coverSwiperList', [tempMusicList[index - 1], tempMusicList[index], tempMusicList[index + 1]]])
      } else if (index === musicCount) {
        this.SET_PAGE_DATA(['player', 'coverSwiperList', [tempMusicList[musicCount - 1], tempMusicList[musicCount]]])
      }
    },

    // 评论总量
    commentsCount(id) {
      commentMusicApi({
        id: id,
        limit: 0,
        offset: 0
      }).then(succ => {
        console.log('获取评论总量（success）：', succ)
        let total = succ.total
        if (total >= 100 && total < 1000) {
          total = '99+'
        } else if (total >= 1000 && total < 10000) {
          total = '999+'
        } else if (total === 10000) {
          total = '1w'
        } else if (total > 10000) {
          total = '1w+'
        }
        this.SET_PAGE_DATA(['player', 'comments', total])
      }).catch(err => {
        console.warn('获取评论总量（error）：', err)
      })
    },

    // 获取歌曲 url
    setMusicUrl(id, level) {
      songUrlApi({
        ids: id,
        level: level,
        encodeType: 'aac',  // aac、flac
      }).then(succ => {
        console.log('获取歌曲 url(success)：', succ)
        if (succ.data[0].url === '') {
          this.$toast('歌曲URL为空，可能为非冲国IP所致')
          return
        }
        this.audio.src = succ.data[0].url
        // 设置总时长
        this.setTotalTime()
        // 设置当前码率
        this.SET_PAGE_DATA(['audio', 'codeRate', succ.data[0].br])
        this.SET_PAGE_DATA(['audio', 'level', succ.data[0].level])
      }).catch(err => {
        console.warn('获取歌曲 url(error)：', err)
        this.SET_PAGE_DATA(['trigger', 'currentTime', 0])
      })
    },

    // 请求歌曲
    requestMusic(id, level) {
      console.log('<-----# 触发歌曲请求 #----->')
      let index = getGLOBAL('musicListIds').indexOf(id)
      if (index === -1) {
        console.log(`<-----# 歌曲数组中无 ${id} 歌曲 #----->`)
        return
      }
      if (level === undefined) {
        this.changeMusic(index, id, getMusicList(index).quality.l === null ? (getMusicList(index).quality.m === null ? (getMusicList(index).quality.h === null ? 'error' : 'exhigh') : 'higher') : 'standard')
      } else {
        this.SET_PAGE_DATA(['trigger', 'currentTime', getGLOBAL('audio').currentTime])
        this.setMusicUrl(id, level)
      }
    },

    // 换歌
    changeMusic(index, id, level) {
      // 音乐暂停
      this.SET_PAGE_DATA(['audio', 'isPlaying', false])
      // 清空当前时间计算定时器
      this.sendCurrentTime('clear')
      // 当前播放 id
      this.SET_GLOBAL(['playingId', id])
      // 设置当前播放索引
      this.SET_GLOBAL(['playIndex', index])
      // 清空全局播放页数据
      this.SET_PAGE_DATA(['audio', 'buffered', 0])
      this.SET_PAGE_DATA(['audio', 'level', null])
      this.SET_PAGE_DATA(['audio', 'currentTime', 0])
      this.SET_PAGE_DATA(['audio', 'totalTime', '00:00'])
      this.SET_PAGE_DATA(['player', 'comments', 0])
      this.SET_PAGE_DATA(['player', 'lyricList', []])
      this.SET_PAGE_DATA(['player', 'lyricTarget', 0])
      this.SET_PAGE_DATA(['player', 'lyricTimeLine', []])
      // cover 预热
      console.log(getMusicList(index).album.pic)
      if (typeof getMusicList(index).album.pic === 'number') {
        this.SET_MUSIC_LIST_COVER_BLOB_URL([index, getGLOBAL('1px')['transparent']])
        this.SET_PAGE_DATA(['player', 'coverUrlBlob', getGLOBAL('1px')['888888']])
      } else {
        imgToBlob(getMusicList(index).album.pic + '?imageView=1&thumbnail=400x0', res => { this.SET_MUSIC_LIST_COVER_BLOB_URL([index, res]) })
        imgToBlob(getMusicList(index).album.pic + '?imageView=1&thumbnail=400x0', blur => { this.SET_PAGE_DATA(['player', 'coverUrlBlob', blur]) }, 100, -0.2)
      }
      // 更新 cover swiper 数组
      this.reloadCoverSwiper(index)
      // 获取歌词
      this.setLyric(id)
      // 获取评论量
      this.commentsCount(id)
      // 获取 url
      this.setMusicUrl(id, level)
      // console 歌词
      console.clear()
      console.info('%c console 歌词系统启动 - by KA ', 'color:#db2c1f;background:rgba(0,0,0,0.2);font-size:25px;border-radius:6px')
    }
  }
}
</script>
