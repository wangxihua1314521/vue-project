import Vue from 'vue'
import Vuex from 'vuex'
import router from '@/router/index'
import * as actions from './actions'
import * as getters from './getters'
// 模块
import breadcrumbs from './modules/breadcrumbs'
import ebook from './modules/ebook-edit'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

// 这里只定义全局通用的状态
// 几个子页面或组件间共享的状态按所属模块写到modules中
const store = new Vuex.Store({
  actions,
  getters,
  modules: {
    breadcrumbs,
    ebook
  },
  strict: debug,
  state: {
    auth: '',
    http: '',
    sysReady: false,
    orgInfo: '',
    userInfo: {},
    surname: {}
  },
  mutations: {
        // 登录成功，记录token和用户信息
    loginSuccess (state, {auth, userInfo}) {
      state.auth = auth
      state.userInfo = userInfo
        // 将登陆状态存入session,防止刷新后丢失token
      sessionStorage.setItem('auth', auth)
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
        // 退出登录，清空所有状态
    logout (state) {
      state.auth = ''
      state.http = ''
      state.sysReady = false
      state.orgInfo = ''
      state.userInfo = {}
      state.surname = {}
        // 模块中需要清除的状态（会显示出来并且不会被自动刷新掉的东西）
      state.breadcrumbs.navList = []
      sessionStorage.clear()
      router.replace('/login')
    },
        // 所有的系统url都查询完毕，生成好各系统的访问方法
    allSystemGo (state, http) {
      state.sysReady = true
      state.http = http
    },
    // 获取到了组织
    getOrg (state, org) {
      state.orgInfo = org
    },
    // 选择了姓氏
    changeSurname (state, surname) {
      state.surname = surname
    },
    // 浏览器刷新时，将全部状态存入sessionStorage防止丢失
    saveAll (state) {
      console.log('别急，存了存了')
      sessionStorage.setItem('vuex-store', JSON.stringify(state))
    },
    // 刷新后用session恢复各种状态
    useSession (state, session) {
      let data = JSON.parse(session)
      state = Object.assign(state, data)
    }
  }
})
window.onbeforeunload = function () {
  console.log('卧槽要刷新了，赶紧存一个')
  store.commit('saveAll')
  return false
}
export default store
