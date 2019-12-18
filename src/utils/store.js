import store from '../store/store'

/**
 * get global
 * @param {String} target 目标数据
 */
export function getGLOBAL(target) {
  return store.getters.getGLOBAL(target)
}

/**
 * get windows
 * @param {*} target 目标数据
 */
export function getWindows(target) {
  return store.getters.getWindows(target)
}

/**
 * get musicList
 * @param {Number} index 目标下标
 * 不传参数默认获取当前播放 下标
 */
export function getMusicList(index) {
  if (index === undefined) {
    return store.getters.getMusicList(store.getters.getGLOBAL('playIndex'))
  } else {
    return store.getters.getMusicList(index)
  }
}
