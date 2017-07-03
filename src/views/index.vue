<template>
<div class="wrapper">
    <header class="top-nav">
        <div class="nav-logo">
            <p class="brand-name">华夏根脉-业务中心</p>
        </div>
        <div class="nav-container">
            <div class="user-block">
                <Dropdown trigger="click" placement="bottom-end" @on-click="dropdownClick">
                    <a href="javascript:void(0)">
                        {{account}}
                        <Icon type="arrow-down-b"></Icon>
                    </a>
                    <Dropdown-menu slot="list">
                        <Dropdown-item name="logout"><Icon type="power" />退出登录</Dropdown-item>
                    </Dropdown-menu>
                </Dropdown>
            </div>  
        </div>
    </header>
    <aside class="left-menu">
         <Menu theme="dark" :open-names="openMenu" :active-name="activeMenu" ref="menuComp" accordion>
            <Submenu v-for="menu in menuList" :name="menu.menuId" :key="menu.menuId">
                <template slot="title">
                    <Icon type="ios-paper"></Icon>
                    {{menu.menuName}}
                </template>
                <Menu-item 
                    v-for="sub in menu.children" 
                    :name="sub.url" 
                    :key="menu.menuId" 
                    @click.native="select_menu(sub)">{{sub.menuName}}
                </Menu-item>
            </Submenu>
        </Menu>
    </aside>
    <section class="main-container">
        <div class="nav-panel">
            <Breadcrumb v-show="navList.length > 0">
                <Breadcrumb-item v-for="nav in navList" :href="nav.path || null" :key="nav.name">{{nav.name}}</Breadcrumb-item>
            </Breadcrumb>
        </div>
        <div class="sub-page-panel">
            <!--目前版本vue-router不支持通过设置keep-alive的include和exclude设置缓存,直接缓存全部吧-->
            <transition 
                name="page-change-transition"
                mode="out-in"
                enter-active-class="animate-time zoomInUp"
                leave-active-class="animate-time zoomOutLeft">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </transition>
        </div>
    </section>
    <footer>
        
    </footer>
    </div>
</div>
</template>
<script>
import { mapState } from 'vuex'
import {systemIdKey, systemId} from '@/assets/js/http'

export default {
  data () {
    return {
      openMenu: [],
      activeMenu: '',
      menuList: [],
      trunToList: []
    }
  },
  created () {
    if (this.auth) {
      this.loadMenu()
      this.loadBroSys()
    }
  },
  components: {},
  watch: {
    '$route' () {
      this.match_menu()
    },
    activeMenu () {
        // 选中的菜单发生改变，替换面包屑的1级菜单
      this.match_breadcrumb()
    }
  },
  computed: mapState({
    http: 'http',
    account: state => state.userInfo.tel,
    auth: 'auth',
    navList: state => state.breadcrumbs.navList
  }),
  methods: {
    // 查询菜单
    loadMenu () {
      const url = '/main-menus'
      const param = { systemId }
      this.http('admin', url, 'get', param, res => {
//      console.log('查询菜单结果')
//      console.log(res)
        let menuList = res.data.data
//      console.log(menuList)
        for (let menu of menuList) {
          menu.isOpen = false
          let subMenu = menu.children
          for (let sub of subMenu) {
            sub.url = this.formateUrl(sub.url)
          }
        }
        this.menuList = menuList
        this.match_menu()
      })
    },
    // 查询其余后台
    loadBroSys () {
      const auth = this.auth.substring(6, this.auth.length)
      const account = this.account
      const url = `/relative-systems?systemIdKey=${systemIdKey}`
      this.http('admin', url, 'get', '', res => {
//      console.log('查询兄弟系统')
//      console.log(res)
        let turnToList = res.data.data
        for (let sys of turnToList) {
          sys.homeUrl = `${sys.homeUrl}?a=${auth}&u=${account}`
        }
        this.turnToList = turnToList
      })
    },
    // 选择某菜单
    select_menu (menu) {
      const targetUrl = `/index/${menu.url}`
//    console.log(`跳转目标URL:${targetUrl}`)
      this.$router.push(targetUrl)
    },
    // 根据传入的url，找到对应的菜单项和子菜单
    // 假如url有重复也只取第一个匹配到，毕竟路由不应该出现重复
    query_menu_byUrl (url) {
      for (let menu of this.menuList) {
        let children = menu.children
        for (let sub of children) {
          if (sub.url === url) {
            return {
              menu,
              sub
            }
          }
        }
      }
      return null
    },
    // 根据路由匹配菜单
    match_menu () {
      const nowPath = this.$router.currentRoute.path
//    console.log('当前路由')
//    console.log(nowPath)
      if (nowPath.indexOf('/index') === 0) {
        if (nowPath === '/index') {
          this.openMenu = []
          this.activeMenu = ''
        } else {
            // 如果是1级子页面，对应到左侧菜单
            // 2级子页面如添加页，详情页是映射不到的
          let activeMenu = nowPath.substring(7)
          let menuItem = this.query_menu_byUrl(activeMenu)
          if (menuItem === null) return
          let openMenu = menuItem.menu
          this.openMenu = [openMenu.menuId]
          this.activeMenu = activeMenu
        }
        this.$nextTick(() => {
          this.$refs.menuComp.updateOpened()
          this.$refs.menuComp.updateActiveName()
        })
      }
    },
    // 根据路由匹配面包屑
    // 在菜单选择项发生变化后生效
    match_breadcrumb () {
      const nowPath = this.$router.currentRoute.path
      if (nowPath.indexOf('/index') === 0 && nowPath !== '/index') {
        let url = nowPath.substring(7)
        let menuItem = this.query_menu_byUrl(url)
        let subMenu = menuItem.sub
        let targetUrl = this.formateUrl(subMenu.url)
        let nav = {
          path: `/index/${targetUrl}`,
          name: subMenu.menuName
        }
        this.$store.commit('TOP_NAV_CHANGE', nav)
      }
    },
    // 总后台配置的路径不太标准，有的是/clan/news，有的是clan/news，这里统一去掉开头斜杠
    formateUrl (url) {
      return url.startsWith('/') ? url.substring(1) : url
    },
    // 下拉功能菜单，通过菜单上的name来标识点中的项
    dropdownClick (name) {
      if (name === 'logout') this.logout()
    },
    // 退出登录
    logout () {
      console.log('登出')
      this.$store.commit('logout')
    }
  }
}
</script>

<style scoped>
/*导航*/
.top-nav {
    position: relative;
    width: 100%;
    height: 70px;
    background: #313131;
    z-index: 10;
}
.nav-logo {
    position: relative;
    float: left;
    padding: 5px 10px;
}
.nav-logo p {
    margin: 5px 0 20px;
}
.brand-name {
    width: 200px;
    font-size: 22px;
    font-weight: 400;
    color: #fefefe;
}
.nav-container {
    height: 100%;
    margin-left: 240px;
}
.user-block {
    float: right;
    margin: 26px 25px;
}
.user-block a {
    font-size: 14px;
    color: #fff;
}
/*主体侧边菜单*/
.left-menu {
    position: absolute;
    top: 70px;
    left: 0;
    bottom: 0;
    width: 240px;
    height: calc(100% - 70px);
    background: rgb(70, 76, 91);
}
/*主容器*/
.main-container {
    position: absolute;
    left: 240px;
    top: 70px;
    right: 0;
    bottom: 0;
    padding: 10px 0 0 10px;
    overflow-y: scroll
}
/*主容器内全局导航*/
.nav-panel {
    padding-bottom: 10px;
}
.sub-page-panel {
    min-height: 200px;
    padding: 10px;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0 2px 3px hsla(0,0%,4%,.1),0 0 0 1px hsla(0,0%,4%,.1);
}
</style>
