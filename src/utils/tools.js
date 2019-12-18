/**
 * 播放量格式化
 * @param {Number} num 播放量
 */
export function formatCount(num) {
  if (num >= 0 && num < 100000) {
    return Math.floor(num)
  } else if (num >= 100000 && num < 100000000) {
    let temp = (num / 10000).toFixed(1)
    if (temp.split('.')[1] === '0') {
      return Math.floor(num / 10000) + '万'
    } else {
      return temp + '万'
    }
  } else if (num >= 100000000) {
    let temp = (num / 100000000).toFixed(1)
    if (temp.split('.')[1] === '0') {
      return Math.floor(num / 100000000) + '亿'
    } else {
      return temp + '亿'
    }
  } else {
    return 'err'
  }
}

/**
 * 时长格式化
 * @param {Number} duration 时长
 */
export function durationFormat(duration) {
  let tempTotalTime = Math.floor(duration / 1000)
  let totalTimeMinute = Math.floor(Math.round(tempTotalTime) / 60) < 10 ? '0' + Math.floor(Math.round(tempTotalTime) / 60) : Math.floor(Math.round(tempTotalTime) / 60)
  let totalTimeSecond = Math.floor(tempTotalTime) % 60 < 10 ? '0' + Math.floor(tempTotalTime) % 60 : Math.floor(tempTotalTime) % 60
  return totalTimeMinute + ':' + totalTimeSecond
}

/**
 * 日期格式化
 * @param {Number} timestamp 时间戳
 * @param {String} style 字符串样式
 * @param {String} separator 分隔符
 */
export function timestampToTime(timestamp, style, separator) {
  let date = new Date(Number(timestamp))
  let Y = date.getFullYear()
  let M = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
  let D = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
  let H = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()
  let m = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
  let S = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()
  if (style === 'YM') {
    return Y + '年' + M + '月'
  } else if (style === 'YMD') {
    return Y + separator + M + separator + D
  } else if (style === 'YMDHmS') {
    return Y + '年' + M + '月' + D + '日 ' + H + ':' + m + ':' + S
  }
}

/**
 * 评论发送日期转换
 * @param {Number} t 时间戳
 */
export function sendTimeConversion(t) {
  let nowDate = null
  let todayLast = null
  if (nowDate === null || todayLast === null) {
    // 当前 Unix 时间戳
    nowDate = new Date().getTime()
    // 今天 23:59:59.999 时间戳
    todayLast = new Date(new Date().setHours(23, 59, 59, 999)).getTime()
  }
  if ((nowDate - t) <= 60000) {
    return '刚刚'
  } else if ((nowDate - t) > 60000 && (nowDate - t) <= 3600000) {
    let pastTimeUnix = nowDate - t
    let pastTime = new Date(Number(pastTimeUnix))
    return `${pastTime.getMinutes()}分钟前`
  } else if ((todayLast - t) > 3600000 && (todayLast - t) <= 86400000) {
    let userDate = new Date(Number(t))
    let UH = userDate.getHours() < 10 ? `0${userDate.getHours()}` : userDate.getHours()
    let Um = userDate.getMinutes() < 10 ? `0${userDate.getMinutes()}` : userDate.getMinutes()
    return `${UH}:${Um}`
  } else if ((todayLast - t) > 86400000 && (todayLast - t) <= 172800000) {
    let userDate = new Date(Number(t))
    let UH = userDate.getHours() < 10 ? `0${userDate.getHours()}` : userDate.getHours()
    let Um = userDate.getMinutes() < 10 ? `0${userDate.getMinutes()}` : userDate.getMinutes()
    return `昨天${UH}:${Um}`
  } else if ((todayLast - t) > 172800000 && (todayLast - t) <= 31557600000) {
    let userDate = new Date(Number(t))
    return `${userDate.getMonth() + 1}月${userDate.getDate()}日`
  } else {
    let userDate = new Date(Number(t))
    return `${userDate.getFullYear()}年${userDate.getMonth() + 1}月${userDate.getDate()}日`
  }
}

/**
 * 日期转星座
 * @param {Number} date 日期
 */
export function constellation(date) {
  if (date >= 1.21 && date <= 2.19) {
    return '水瓶座'
  } else if (date >= 2.19 && date <= 3.20) {
    return '双鱼座'
  } else if (date >= 3.21 && date <= 4.20) {
    return '牧羊座'
  } else if (date >= 4.20 && date <= 5.21) {
    return '金牛座'
  } else if (date >= 5.21 && date <= 6.22) {
    return '双子座'
  } else if (date >= 6.23 && date <= 7.23) {
    return '巨蟹座'
  } else if (date >= 7.24 && date <= 8.23) {
    return '狮子座'
  } else if (date >= 8.23 && date <= 9.23) {
    return '处女座'
  } else if (date >= 9.23 && date <= 10.24) {
    return '天枰座'
  } else if (date >= 10.24 && date <= 11.23) {
    return '天蝎座'
  } else if (date >= 11.23 && date <= 12.22) {
    return '射手座'
  } else if (date >= 12.22 || date <= 1.21) {
    return '摩羯座'
  } else {
    return ''
  }
}

// 年龄转换
export function ageExchange(year) {
  if (year <= 2000) {
    return year.toString().substring(2, 3) + '0后'
  } else {
    if (year.toString().substring(3, 4) < 5) {
      return year.toString().substring(2, 3) + '0后'
    } else {
      return year.toString().substring(2, 3) + '5后'
    }
  }
}

// /**
//  * 高斯模糊
//  * @param {String} url 图片链接
//  * @param {Number} blur 模糊值
//  * @param {Number} brightness 明亮值(0 ~ -1)
//  * @param {Function} callback 回调
//  */
// export function glfxImg(url, blur, brightness, callback) {
//   let img = document.createElement('img')
//   img.src = url
//   setTimeout(() => {
//     let canvas = glfx.canvas()
//     let texture = canvas.texture(img)
//     canvas.draw(texture).lensBlur(blur, -1, 0).brightnessContrast(brightness, 0).update()
//     callback(canvas.toDataURL('image/jpeg', 0.8))
//   })
// }

// /**
//  * 图片转 base64
//  * @param {String} imgUrl 图片链接
//  * @param {Function} callback 回调
//  */
// export function imgToBase64(imgUrl, callback) {
//   window.URL = window.URL || window.webkitURL
//   let xhr = new XMLHttpRequest()
//   xhr.open('get', imgUrl, true)
//   xhr.responseType = 'blob'
//   xhr.onload = function() {
//     if (this.status === 200) {
//       let blob = this.response
//       let oFileReader = new FileReader()
//       oFileReader.onloadend = function(e) { callback(e.target.result) }
//       oFileReader.readAsDataURL(blob)
//     }
//   }
//   xhr.send()
// }

import glfx from 'glfx'
// /**
//  * 图片转 blob
//  * @param {String} url 图片链接
//  * @param {Function} callback 回调
//  * @param {Function} blur 模糊值
//  * @param {Function} brightness 明亮值(0 ~ -1)
//  */
// export function imgToBlob(url, callback, blur, brightness) {
//   let img = new Image()
//   img.setAttribute('crossOrigin', 'anonymous')
//   img.src = url
//   img.onload = () => {
//     let canvas = null
//     if (blur === undefined || brightness === undefined) {
//       canvas = document.createElement('canvas')
//       canvas.width = img.width
//       canvas.height = img.height
//       let ctx = canvas.getContext('2d')
//       ctx.drawImage(img, 0, 0, img.width, img.height)
//     } else {
//       canvas = glfx.canvas()
//       let texture = canvas.texture(img)
//       canvas.draw(texture).lensBlur(blur, -1, 0).brightnessContrast(brightness, 0).update()
//     }
//     canvas.toBlob(blob => { callback(URL.createObjectURL(blob)) })
//   }
// }

/**
 * 图片转 base64
 * @param {String} url 图片链接
 * @param {Function} callback 回调
 * @param {Function} blur 模糊值
 * @param {Function} brightness 明亮值(0 ~ -1)
 */
export function imgToBlob(url, callback, blur, brightness) {
  let img = new Image()
  img.setAttribute('crossOrigin', 'anonymous')
  img.src = url
  img.onload = () => {
    let canvas = null
    if (blur === undefined || brightness === undefined) {
      canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      let ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, img.width, img.height)
    } else {
      canvas = glfx.canvas()
      let texture = canvas.texture(img)
      canvas.draw(texture).lensBlur(blur, -1, 0).brightnessContrast(brightness, 0).update()
    }
    callback(canvas.toDataURL('image/jpeg', 0.8))
  }
}

/**
 * blob 方式跨域下载图片
 * @param {String} url 图片链接
 * @param {String} name 本地保存的图片名
 * @param {Boolean} dl 是否下载
 */
export function downloadByBlob(url, name = 'image') {
  let img = new Image()
  img.setAttribute('crossOrigin', 'anonymous')
  img.src = url
  img.onload = () => {
    let canvas = document.createElement('canvas')
    canvas.width = img.width
    canvas.height = img.height
    let ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, img.width, img.height)
    canvas.toBlob((blob) => {
      let url = URL.createObjectURL(blob)
      download(url, name)
      URL.revokeObjectURL(url)  // 用完释放URL对象
    })
  }
}
export function download(href, name = 'image') {
  let a = document.createElement('a')
  a.download = name
  a.href = href
  a.click()
  a.remove()
}

/**
 * 项目核心数据列表
 * @param {Object} data 数据
 * @param {Object} source 来源
 */
export function projectMainCoreData(data, source) {
  // 艺术家信息
  let tempArtist = []
  for (let i = 0; i < data.ar.length; i++) {
    tempArtist.push({
      id: data.ar[i].id,
      name: data.ar[i].name,
      pic: 'data:image/gif;base64,R0lGODlhAQABAPAAAO7u7gAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=='   // #eeeeee 多艺术家弹窗展示图片用
    })
  }
  let tempData = {
    song: {
      id: data.id,
      name: data.name
    },
    album: {
      id: data.al.id,
      name: data.al.name,
      pic: data.al.hasOwnProperty('picUrl') ? data.al.picUrl : data.al.pic,
      picId: data.al.hasOwnProperty('picUrl') ? data.al.pic_str : 'data:image/gif;base64,R0lGODlhAQABAPAAAIiIiAAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==',   // #888888 player 页全屏 cover 下载命名用
      blob: ''
    },
    quality: {
      h: data.h,
      m: data.m,
      l: data.l
    },
    artist: tempArtist,
    mv: data.mv,
    alia: data.alia,
    duration: data.dt,
    source: source
  }
  return tempData
}