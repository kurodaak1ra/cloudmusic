import store from '../store/store'
import { SET_GLOBAL, SET_PAGE_DATA, SET_WINDOWS } from '../store/mutation-type'
import router from '../router'
import Toast from './toast'
import Vue from 'vue'

Vue.use(Toast, {
  defaultType: 'bottom',
  duration: 3000
})

/**
 * 跳艺术家
 * @param {Number, Array} ar 艺术家 id
 */
export function goArtist(ar) {
  if (!/number|object/i.test(typeof ar)) {
    Vue.prototype.$toast('无法找到该用户信息')
    return
  }
  if (/object/i.test(typeof ar) && ar.length > 1) {
    store.commit(SET_PAGE_DATA, ['simple', 'multipleArtist', ar])
    store.commit(SET_WINDOWS, ['simple', 'over-one-artist'])
  } else {
    if (/number/i.test(typeof ar)) {
      store.commit(SET_PAGE_DATA, ['artist', 'id', ar])
    } else {
      store.commit(SET_PAGE_DATA, ['artist', 'id', ar[0].id])
    }
    if (router.history.current.path !== '/artist') router.push({ path: '/artist' })
  }
}

/**
 * 跳评论
 * @param {Number} type 来源类型
 * @param {Number} id 来源 id
 * @param {Number} uid 用户 id
 * @param {String} title 标题
 * @param {String} author 作者
 * @param {String} coverUrl 封面
 */
export function goComments(type, id, uid, title, author, coverUrl) {
  if (!/number/i.test(typeof id)) {
    Vue.prototype.$toast('无法找到评论信息')
    return
  }
  store.commit(SET_PAGE_DATA, ['comments', 'type', type])
  store.commit(SET_PAGE_DATA, ['comments', 'id', id])
  store.commit(SET_PAGE_DATA, ['comments', 'uid', uid])
  store.commit(SET_PAGE_DATA, ['comments', 'title', title])
  store.commit(SET_PAGE_DATA, ['comments', 'author', author])
  store.commit(SET_PAGE_DATA, ['comments', 'coverUrl', coverUrl])
  router.push({ path: '/comments' })
}

/**
 * 点击播放
 * @param {Number} id 准备播放的 id
 * @param {Number} play 是否可以播放（码率不等于0）
 * @param {Array} list 主数据列表
 * @param {Array} ids 歌曲 id 列表
 * @param {Sreing} from 触发方式
 */
export function goPlay(id, play, list, ids, from = 'default') {
  if (!/number/i.test(typeof id)) {
    Vue.prototype.$toast('内部错误：goPlay Function Id Not An Number Type')
    return
  }
  if (play === 0) {
    store.commit(SET_WINDOWS, ['simple', 'no-copyright'])
    return
  }
  if (id === store.state.GLOBAL.playingId && from !== 'info') {
    router.push({ path: '/player' })
    return
  }
  if (from === 'default') {
    store.commit(SET_GLOBAL, ['musicList', list])
    store.commit(SET_GLOBAL, ['musicListIds', ids])
  } else if (from === 'search') {
    let tempMusicList = store.state.GLOBAL.musicList
    let tempMusicListIds = store.state.GLOBAL.musicListIds
    let tempPlayIndex = store.state.GLOBAL.playIndex === null ? 0 : store.state.GLOBAL.playIndex + 1
    let exist = tempMusicListIds.indexOf(id)
    if (exist !== -1) tempMusicList.splice(exist, 1)
    tempMusicListIds.splice(tempPlayIndex + 1, 0, id)
    tempMusicList.splice(tempPlayIndex + 1, 0, list)
  }
  store.commit(SET_PAGE_DATA, ['trigger', 'songId', id])
}

/**
 * 跳专辑
 * @param {Number} id 专辑 id
 * @param {String} name 专辑名
 * @param {String} copywriter 推荐信息
 */
export function goAlbum(id, name, copywriter = '') {
  if (!/number/i.test(typeof id)) {
    Vue.prototype.$toast('无法找到专辑信息')
    return
  }
  store.commit(SET_PAGE_DATA, ['album', 'id', id])
  store.commit(SET_PAGE_DATA, ['album', 'name', name])
  store.commit(SET_PAGE_DATA, ['album', 'copywriter', copywriter])
  router.push({ path: '/album' })
}

/**
 * 跳歌单
 * @param {Number} id 歌单 id
 * @param {String} name 歌单名
 * @param {String} copywriter 推荐信息
 */
export function goPlaylist(id, name = '', copywriter = '') {
  if (!/number/i.test(typeof id)) {
    Vue.prototype.$toast('无法找到歌单信息')
    return
  }
  store.commit(SET_PAGE_DATA, ['playlist', 'id', id])
  store.commit(SET_PAGE_DATA, ['playlist', 'name', name])
  store.commit(SET_PAGE_DATA, ['playlist', 'copywriter', copywriter])
  router.push({ path: '/playlist' })
}

/**
 * 跳用户
 * @param {Number} uid 用户 id
 */
export function goUser(uid) {
  if (!/number/i.test(typeof uid)) {
    Vue.prototype.$toast('无法找到该用户信息')
    return
  }
  store.commit(SET_PAGE_DATA, ['user', 'id', uid])
  router.push({ path: '/user' })
}

/**
 * 未登录拦截
 * @param {String} path 来源
 * @param {Number} id 来源 id
 */
export function goLogin(path, id) {
  router.push({
    path: '/login',
    query: {
      path: path,
      id: id
    }
  })
  return
}