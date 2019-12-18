import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

// 路由懒加载
const page = name => () => import(`@/views/${name}`)

export default new Router({
  mode: 'history',
  // base: '/music',
  routes: [
    {
      path: '/',
      name: 'root',
      redirect: '/slogan'
    }, {
      path: '/slogan',
      name: 'slogan',
      component: page('slogan')
    }, {
      path: '/homepage',
      name: 'homepage',
      component: page('homepage/index')
    }, {
      path: '/login',
      name: 'login',
      component: page('login')
    }, {
      path: '/email',
      name: 'login-email',
      component: page('login-email')
    }, {
      path: '/cellphone',
      name: 'login-cellphone',
      component: page('login-cellphone')
    }, {
      path: '/player',
      name: 'player',
      component: page('player')
    }, {
      path: '/search',
      name: 'search',
      component: page('search')
    }, {
      path: '/search-result',
      name: 'search-result',
      component: page('search-result')
    }, {
      path: '/playlist',
      name: 'playlist',
      component: page('playlist')
    }, {
      path: '/playlist-edit',
      name: 'playlist-edit',
      component: page('playlist-edit')
    }, {
      path: '/subscribers',
      name: 'aubscribers',
      component: page('subscribers')
    }, {
      path: '/comments',
      name: 'comments',
      component: page('comments')
    }, {
      path: '/user',
      name: 'user',
      component: page('user')
    }, {
      path: '/user-info',
      name: 'user-info',
      component: page('user-info')
    }, {
      path: '/my-collect',
      name: 'my-collect',
      component: page('my-collect')
    }, {
      path: '/album',
      name: 'album',
      component: page('album')
    }, {
      path: '/artist',
      name: 'artist',
      component: page('artist')
    }, {
      path: '/artist-details',
      name: 'artist-details',
      component: page('artist-details')
    }, {
      path: '/my-details',
      name: 'my-details',
      component: page('my-details')
    }, {
      path: '/digital-album',
      name: 'digital-album',
      component: page('digital-album')
    }, {
      path: '/description',
      name: 'description',
      component: page('develope-info/description')
    }, {
      path: '/update',
      name: 'update',
      component: page('develope-info/update')
    }, {
      path: '/test',
      name: 'test',
      component: page('test')
    }
  ]
})
