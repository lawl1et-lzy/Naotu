import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
const Func = () => import('@/views/func')
const Identity = () => import('@/views/identity')
const IdentityFunc = () => import('@/views/identityFunc')
const UserIdentity = () => import('@/views/userIdentity')

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
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    name: 'Login',
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home/:_id?',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '我的文件', icon: 'dashboard' }
    }]
  },
  {
    path: '/naotueditor/:id',
    name: 'NaotuEditor',
    component: () => import('@/views/naotuEditor/index'),
    hidden: true,
    meta: {
      title: '脑图编辑'
    }
  },
  {
    path: '/trash',
    component: Layout,
    redirect: '/trash',
    name: 'TrashCom',
    children: [{
      path: '/trash',
      name: 'Trash',
      component: () => import('@/views/trash/index'),
      meta: { title: '回收站', icon: 'trash' }
    }]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/',
    name: 'system',
    meta: { title: '系统配置', icon: 'example' },
    children: [{
      path: '/func',
      name: 'Func',
      component: Func,
      meta: { title: '功能配置', icon: 'trash' }
    },{
      path: '/identity',
      name: 'Identity',
      component: Identity,
      meta: { title: '角色配置', icon: 'trash' }
    },{
      path: '/identityFunc',
      name: 'IdentityFunc',
      component: IdentityFunc,
      meta: { title: '角色-功能', icon: 'trash' }
    },{
      path: '/userIdentity',
      name: 'UserIdentity',
      component: UserIdentity,
      meta: { title: '用户-角色', icon: 'trash' }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  base: 'naotu',
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// qingqingtst: 设置回收站显隐
// router.beforeEach((to, from, next) => {
//   const qingqingtst = to.query.qingqingtst
//   if (qingqingtst) {
//     const routes = router.options && router.options.routes
//     if (Array.isArray(routes) && routes.length > 0) {
//       const trash = routes.find(item => item.name === 'TrashCom')
//       if (trash) trash.hidden = false
//     }
//   }
//   next()
// })

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
