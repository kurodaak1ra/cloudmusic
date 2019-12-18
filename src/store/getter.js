import {
  getGLOBAL,
  getMusicList,
  getWindows
} from './getter-type'

export default {
  // 获取 GLOBAL
  [getGLOBAL]: state => target => {
    return state.GLOBAL[target]
  },
  // 获取音乐数组
  [getMusicList]: state => index => {
    return state.GLOBAL.musicList[index]
  },
  // 获取弹窗状态
  [getWindows]: state => target => {
    return state.windows[target]
  }
}
