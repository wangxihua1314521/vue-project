import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import store from '@/store'
import { paramToString as allToStr } from './util'

// const ADMIN_URL = 'https://api.hxgmw.com/zht'
const ADMIN_URL = 'http://192.168.18.201:8080/hxgm-admin-web'
const VERSION = '/rest/v1.0'
const LOAD_SYS_URL = VERSION + '/systems/base-info'
const systemIdKey = 'hxgm-agent-admin-web.systemId'
const systemId = 'eacdc1e4-39b4-4d1c-aea0-ecaf068ce795'

// 各系统路径映射的名称
let sysMap = new Map()
// 空的vue实例，用于在js中调用iview的方法
const vm = new Vue()

/**
 * 基础的ajax方法，使用axios库
 * 除了登陆和查询全系统路径直接使用写死的ADMIN_URL
 * 其余都用各自系统对应的地址
 */
const sendAjax = (urlBase, url, method, params, success, error) => {
  axios({
    method,
    url,
    baseURL: url.startsWith('http') ? '' : (urlBase || (ADMIN_URL + VERSION)),
    headers: {
      'Accept': 'application/jsoncharse=utf-8',
      'Authorization': store.state.auth
    },
    params: method === 'get' ? allToStr(params) : '',
    data: method !== 'get' ? allToStr(params) : ''
  })
  .then(response => {
    const resCode = +response.data.code
    if (resCode === 200) {
      success && success(response)
    } else {
            // 后台报错码
      console.error(`接口：${url}报错,后台返回错误:`)
      console.error(response.data)
      switch (resCode) {
        case 304: case 310:
                // 超时
          vm.$Message.warning('超时，请重新登陆', 3)
          store.commit('logout')
          break
        default:
          vm.$Message.error('系统错误', 3)
          break
      }
      error && error(response)
    }
  })
  .catch(errorMsg => {
    if (errorMsg.config) {
      vm.$Message.error('网络连接失败,请稍后重试', 3)
            // 如果在加载全系统路径这一步出错，一般是服务器重启，登出
      if (url.includes(LOAD_SYS_URL)) store.commit('logout')
    }
  })
}

/*
 * 启动系统,登录成功后调用
 * 载入全系统路径
 * 定义接口名称映射
 */
const startSystem = async () => {
  let sysList
  try {
    sysList = await loadAllSys()
  } catch (e) {
    router.replace('/login')
  }
  for (let sys of sysList) {
    let sysUrl = sys.baseUrl + sys.contextPath
    let urlBase = sysUrl + VERSION
        // 生成个系统的访问接口
    switch (sys.contextPath) {
            // 系统总后台
      case '/hxgm-admin-web':
        sysMap.set('admin', urlBase)
        break
        // 运营平台
      case '/hxgm-agent-admin-web':
        sysMap.set('agent', urlBase)
        break
        // 业务中心
      case '/hxgm-business-web':
        sysMap.set('business', urlBase)
        break
        // 配置中心
      case '/hxgm-config-web':
        sysMap.set('config', urlBase)
        break
        // 内网
      case '/hxgm-site-web':
        sysMap.set('site', urlBase)
        break
        // 内容维审平台
      case '/hxgm-site-admin-web':
        sysMap.set('site-admin', urlBase)
        break
        // 文件系统
        // 文件系统-》md5验证
      case '/hxgm-file-web':
        sysMap.set('file', urlBase)
        break
      default:
        break
    }
  }
    /*
     * 对外提供的统一接口访问路径
     * 并把访问方法交给vuex做全局管理
     */
  const http = (sys, url, method, param, success, error) => {
    const urlBase = sysMap.get(sys)
    sendAjax(urlBase, url, method, param, success, error)
  }
  Vue.prototype.http = http
  console.log('系统访问接口生成完毕')
  store.commit('allSystemGo', http)
}

/*
 * 加载全系统路径，系统名称对应如下:
 * /hxgm-official-admin-web 官网后台
 * /hxgm-message-web        消息中心
 * /hxgm-site-admin-web     内网后台
 * /hxgm-mall-web           根脉商城
 * /hxgm-job-web            控制中心
 * /hxgm-report-web         报表系统
 * /hxgm-config-web         配置中心
 * /hxgm-site-web           内网
 * /hxgm-offical-web        官网
 * /hxgm-agent-admin-web    运营平台
 * /hxgm-log-web            日志系统
 * /hxgm-file-web           文件管理系统
 * /hxgm-admin-web          系统总后台
 * /hxgm-business-web       业务中心
 */
const loadAllSys = () => {
  return new Promise((resolve, reject) => {
    sendAjax(ADMIN_URL, LOAD_SYS_URL, 'get', '', res => {
      console.log('加载完全系统路径')
      const result = res.data
      if (+result.code === 200) {
        resolve(result.data)
      } else {
        console.error(result.msg)
        reject(result.msg)
      }
    },
    error => {
      console.error('加载全系统路径错误')
      reject(error)
    })
  })
}

export {
  sendAjax,
  systemIdKey,
  systemId,
  startSystem
}
