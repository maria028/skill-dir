import Layout from '@/page/index/'

export default [{
  path: '/login',
  name: '登录页',
  component: resolve => require(['@/page/login/index'], resolve),
  meta: {
    keepAlive: true,
    isTab: false,
    isAuth: false
  }
},
  {
    path: '/lock',
    name: '锁屏页',
    component: resolve => require(['@/page/lock/index'], resolve),

    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/404',
    component: resolve => require(['@/components/error-page/404'], resolve),
    // () =>
    //   import( /* webpackChunkName: "page" */ '@/components/error-page/404'),
    name: '404',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }

  },
  {
    path: '/403',
    component: resolve => require(['@/components/error-page/403'], resolve),
    // () =>
    //   import( /* webpackChunkName: "page" */ '@/components/error-page/403'),
    name: '403',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/500',
    component: resolve => require(['@/components/error-page/500'], resolve),
    name: '500',
    meta: {
      keepAlive: true,
      isTab: false,
      isAuth: false
    }
  },
  {
    path: '/',
    name: '主页',
    redirect: '/wel'
  },
  {
    path: '/myiframe',
    component: Layout,
    redirect: '/myiframe',
    children: [{
      path: ":routerPath",
      name: 'iframe',
      component: resolve => require(['@/components/iframe/main'], resolve),
      props: true
    }]

  },
  {
    path: '*',
    redirect: '/404'
  }

]
