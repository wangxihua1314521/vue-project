import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import {startSystem} from '@/assets/js/http'
Vue.use(Router)

const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition
  } else {
    const position = {}
    // new navigation.
    // scroll to anchor by returning the selector
    if (to.hash) {
      position.selector = to.hash
    }
    // check if any matched route config has meta that requires scrolling to top
    if (to.matched.some(m => m.meta.scrollToTop)) {
      // cords will be used if no selector is provided,
      // or if the selector didn't match any element.
      position.x = 0
      position.y = 0
    }
    // if the returned position is falsy or an empty object,
    // will retain current scroll position.
    return position
  }
}

export default new Router({
  mode: 'history',
  base: __dirname,
  scrollBehavior,
  routes: [
    {
      path: '/',
      name: 'login',
      component: resolve => require(['@/views/login'], resolve)
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['@/views/login'], resolve)
    },
    {
      path: '/index',
      name: 'index',
      component: resolve => require(['@/views/index'], resolve),
      beforeEnter: async (to, from, next) => {
        console.log('首页路由钩子')
        // 进入首页前确认加载好全系统路径
        if (store.state.sysReady) {
          console.info('进入首页')
          next()
        } else {
          let auth = store.state.auth
            // let userInfo
            // 如果没有许可，查看session
            // 刷新页面可能导致许可清空
          if (!auth) {
            const sessionAll = sessionStorage.getItem('vuex-store')
                // const sessionUserInfo = sessionStorage.getItem('userInfo')
            if (sessionAll && sessionAll !== 'undefined') {
              store.commit('useSession', sessionAll)
              console.log('使用session进行路径查询')
              sessionStorage.removeItem('vuex-store')
            } else {
                    // session中也没有许可，不允许跳转,回到login
              next({ path: '/login' })
              return
            }
          }
          await startSystem(auth)
          next()
        }
      },
      children: [
        // app管理员列表
        {
          path: 'appAdmin/appAdmin',
          name: 'appAdmin',
          component: resolve => require(['@/views/appAdmin/appAdmin'], resolve)
        }
      ]
    },
    {path: '*', name: '404-page', component: resolve => require(['@/views/404-page'], resolve)}
  ]
})
