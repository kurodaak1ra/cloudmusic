import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import fastclick from 'fastclick'
import fullscreen from 'vue-fullscreen'
import VueClipboard from 'vue-clipboard2'
import Mask from './utils/mask'
import Loading from './utils/loading'
import Toast from './utils/toast'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'lib-flexible'
import 'swiper/dist/css/swiper.css'
import { FIRST_VISIT } from './store/mutation-type'
// import './vconsole.js'

Vue.use(VueAwesomeSwiper)
Vue.use(fullscreen)
Vue.use(VueClipboard)
Vue.use(Mask)
Vue.use(Loading)
Vue.use(Toast, {
  defaultType: 'bottom',
  duration: 3000
})

fastclick.attach(document.body)

Vue.config.productionTip = false

// 禁止弹出菜单
window.addEventListener('contextmenu', ev => { ev.preventDefault() })

router.beforeEach(async (to, from, next) => {
  // 首次进入页面直接转跳 slogan
  if (store.state.firstVisit) {
    store.commit(FIRST_VISIT, false)
    return next({ path: '/slogan' })
  }
  // 当触发返回操作判断是否有弹窗未关闭
  if (store.getters.getWindows('left') || store.getters.getWindows('info') || store.getters.getWindows('list') || store.getters.getWindows('simple') !== null) {
    Vue.prototype.$rmask()
    return next(false)
  }
  // 进入下一个路由
  next()
})

// 创建 Vue 实例
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
