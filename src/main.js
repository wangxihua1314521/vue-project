// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import {Table, TableColumn, Checkbox, Radio, RadioGroup} from 'element-ui'
import 'iview/dist/styles/iview.css'
import 'element-ui/lib/theme-default/index.css'
import 'iview/dist/iview.min.js'
require('@/assets/js/direct')

Vue.config.productionTip = false

Vue.use(iView)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Checkbox)
Vue.use(Radio)
Vue.use(RadioGroup)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
