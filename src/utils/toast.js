import store from '../store/store'

let Toast = {}
Toast.install = (Vue, options) => {
  let opt = {
    defaultType: 'bottom',            // 默认显示位置
    duration: '3000'                  // 持续时间
  }

  for (let property in options) {
    if (Object.prototype.hasOwnProperty.call(options, property)) opt[property] = options[property]       // 使用 options 的配置
  }

  Vue.prototype.$toast = (tips, type) => {
    if (type) opt.defaultType = type                              // 如果有传type，位置则设为该type
    // 关闭 toast
    if (document.getElementsByClassName('toast').length) {
      clearTimeout(store.state.toastTimeout_1)
      clearTimeout(store.state.toastTimeout_2)
    }
    store.state.toastTimeout_1 = setTimeout(() => {
      document.querySelector('.toast').classList.remove('toast-show')
      document.querySelector('.toast').classList.add('toast-hide')
    }, options.duration)
    store.state.toastTimeout_2 = setTimeout(() => {
      document.body.removeChild(store.state.toastTpl)
    }, (options.duration + 490))

    // 创建 toast
    if (document.getElementsByClassName('toast').length) {
      document.querySelector('.toast').children[0].innerHTML = tips
    } else {
      store.state.toastTpl = new Vue({
        render: h => {
          let children = []
          children.push(h('span', {
            style: {
              display: 'inline-block',
              lineHeight: '1.5em',
              borderRadius: '50px',
              padding: '1em 1.75em',
              background: 'rgba(240, 240, 240, 0.9)'
            }
          }, tips))
          return h('div', {
            class: `toast toast-show toast-${opt.defaultType}`,
            style: {
              position: 'absolute',
              left: '0',
              right: '0',
              zIndex: '99999',
              padding: '0 1em',
              textAlign: 'center'
            }
          }, children)
        }
      }).$mount().$el

      // 把创建的实例添加到body中
      document.body.appendChild(store.state.toastTpl)
    }
  }

  // ['bottom', 'center', 'top'].forEach(type => {
  //   Vue.prototype.$toast[type] = (tips) => {
  //     return Vue.prototype.$toast(tips, type)
  //   }
  // })
}
export default Toast
