import {
  FIRST_VISIT,
  SET_GLOBAL,
  SET_MUSIC_LIST_COVER_BLOB_URL,
  SET_MULTIPLE_ARTIST_PIC_URL,
  SET_PAGE_DATA,
  SET_WINDOWS
} from './mutation-type.js'

export default {
  // 设置第一次访问状态
  [FIRST_VISIT](state, res) {
    state.firstVisit = res
  },
  // 设置 GLOBAL
  [SET_GLOBAL](state, res) {
    state.GLOBAL[res[0]] = res[1]
  },
  // 设置歌曲 cover mask
  [SET_MUSIC_LIST_COVER_BLOB_URL](state, res) {
    state.GLOBAL.musicList[res[0]].album.blob = res[1]
  },
  // 设置多艺术家时图片
  [SET_MULTIPLE_ARTIST_PIC_URL](state, res) {
    state.GLOBAL.simple.multipleArtist[res[0]].pic = res[1]
  },
  // 设置指定页面数据
  [SET_PAGE_DATA](state, res) {
    state.GLOBAL[res[0]][res[1]] = res[2]
  },
  // 控制 windows
  [SET_WINDOWS](state, res) {
    state.windows[res[0]] = res[1]
  }
}
