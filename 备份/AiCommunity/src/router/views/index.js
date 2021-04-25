import Layout from '@/page/index/'

export default [{
  path: '/wel',
  component: Layout,
  redirect: '/wel/index',
  children: [{
    path: 'index',
    name: '首页',
    meta: {
      i18n: 'dashboard'
    },
    component: resolve => require(['@/views/wel'], resolve),
  }]
}, 
// {
//   path: '/test',
//   component: Layout,
//   redirect: '/test/index',
//   children: [{
//     path: 'index',
//     name: '测试页',
//     meta: {
//       i18n: 'test'
//     },
//     component: resolve => require(['@/views/util/test'], resolve)
//   }]
// }, 
{
  path: '/info',
  component: Layout,
  redirect: '/info/index',
  children: [{
    path: 'index',
    name: '个人信息',
    meta: {
      i18n: 'info'
    },
    component: resolve => require(['@/views/user/info'], resolve),
  }]
}

]
