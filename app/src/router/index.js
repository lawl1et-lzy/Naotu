import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
Vue.use(Router)

/* Layout */
import Layout from '@/layout'
const Login = () => import('@/views/login/index')
const P404 = () => import('@/views/404')
const Home = () => import('@/views/home/index')
const Trash = () => import('@/views/trash/index')
const NaotuEditor = () => import('@/views/naotuEditor/index')
const Func = () => import('@/views/func')
const Identity = () => import('@/views/identity')
const IdentityFunc = () => import('@/views/identityFunc')
const UserIdentity = () => import('@/views/userIdentity')
const FileManage = () => import('@/views/demo/fileManage')

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
  * value: Number
 */

/**
 * defaultRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const defaultRoutes = [
  {
    path: '/login',
    component: Login,
    name: 'Login',
    hidden: true
  },
  {
    path: '/404',
    component: P404,
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    meta: { title: '文件管理', icon: 'dashboard' },
    children: [{
      path: 'home/:_id?',
      name: 'Home',
      component: Home,
      meta: { title: '我的文件' }
    },{
      path: 'trash',
      name: 'Trash',
      component: Trash,
      meta: { title: '回收站' }
    }]
  },
  {
    path: '/naotueditor/:_id',
    name: 'NaotuEditor',
    component: NaotuEditor,
    hidden: true,
    meta: {
      title: '脑图编辑'
    }
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/',
    name: 'System',
    hidden: true,
    meta: { title: '系统配置', icon: 'example' },
    children: [{
      path: 'func',
      name: 'Func',
      component: Func,
      hidden: true,
      value: 2,
      meta: { title: '功能' }
    },{
      path: 'identity',
      name: 'Identity',
      component: Identity,
      hidden: true,
      value: 3,
      meta: { title: '角色' }
    },{
      path: 'identityFunc',
      name: 'IdentityFunc',
      component: IdentityFunc,
      hidden: true,
      value: 4,
      meta: { title: '权限配置' }
    },{
      path: 'userIdentity',
      name: 'UserIdentity',
      component: UserIdentity,
      hidden: true,
      value: 5,
      meta: { title: '角色配置' }
    }]
  },
  {
    path: '/demo',
    component: Layout,
    redirect: '/demo',
    meta: { title: 'demo', icon: 'dashboard' },
    children: [{
      path: '图片上传',
      name: 'fileManage',
      component: FileManage,
      meta: { title: '图片上传' }
    }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  base: 'naotu',
  scrollBehavior: () => ({ y: 0 }),
  routes: defaultRoutes
})

const router = createRouter()

router.beforeEach((to, from, next) => {
  const routes = router.options && router.options.routes
  const userInfo = store && store.getters && store.getters.userInfo
  if(!userInfo) {
    // 配置权限
    store.dispatch('user/getUserInfo').then(res => {
      const { funcs } = res
      store.dispatch('user/setUserInfo', res)
      if(Array.isArray(funcs) && funcs.length > 0) {
        for(let func of funcs) {
          let systemCfg = routes.find(route => route.name === 'System')
          for(let subSys of systemCfg.children) {
            if(func.value === subSys.value) {
              subSys.hidden = false
              systemCfg.hidden = false
            }
          }
        }
        store.dispatch('settings/setRouter', routes)
      }
    })
  }
  next()
})

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
