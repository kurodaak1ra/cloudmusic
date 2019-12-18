import store from '../store/store'
import { HIDE_WIN } from '../store/actions-type'
import { SET_WINDOWS } from '../store/mutation-type'

let Mask = {}
Mask.install = (Vue) => {
  Vue.prototype.$mask = () => {
    if (document.getElementsByClassName('mask').length) return
    store.commit(SET_WINDOWS, ['mask', true])
    let tpl = new Vue({
      render: h => h('div', {
        class: 'mask mask-show',
        style: {
          position: 'absolute',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          zIndex: '10',
          background: 'rgba(0, 0, 0, 0.6)'
        },
        on: {
          'click': () => {
            Vue.prototype.$rmask()
          }
        }
      })
    }).$mount().$el
    document.getElementById('app').appendChild(tpl)
  }

  Vue.prototype.$rmask = () => {
    if (document.getElementsByClassName('mask').length === 0) return
    store.dispatch(HIDE_WIN)
    document.getElementsByClassName('mask')[0].classList.remove('mask-show')
    document.getElementsByClassName('mask')[0].classList.add('mask-hide')
    setTimeout(() => {
      document.getElementById('app').removeChild(document.getElementsByClassName('mask')[0])
    }, 190)
  }
}
export default Mask
