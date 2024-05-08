export const constantRoute = [
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login',
    meta: {
      title: '登录',
      hidden: true // 路由在菜单栏中是否展示 true为隐藏
    }
  },
  {
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    redirect: '/home',
    meta: {
      title: '',
      hidden: false
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          hidden: false,
          icon: 'House'
        }
      }
    ]
  },
  {
    path: '/screen',
    component: () => import('@/views/screen/index.vue'),
    name: 'screen',
    meta: {
      hidden: false,
      title: '数据大屏',
      icon: 'DataLine'
    }
  },
  {
    path: '/acl',
    component: () => import('@/layout/index.vue'),
    name: 'Acl',
    redirect: '/acl/user',
    meta: {
      title: '权限管理',
      hidden: false,
      icon: 'Lock'
    },
    children: [
      {
        path: '/acl/user',
        component: () => import('@/views/acl/user/index.vue'),
        name: 'acl',
        meta: {
          title: '用户管理',
          hidden: false,
          icon: 'User'
        }
      },
      {
        path: '/acl/role',
        component: () => import('@/views/acl/role/index.vue'),
        name: 'role',
        meta: {
          title: '职位管理',
          hidden: false,
          icon: 'UserFilled'
        }
      },
      {
        path: '/acl/permission',
        component: () => import('@/views/acl/permission/index.vue'),
        name: 'permission',
        meta: {
          title: '菜单管理',
          hidden: false,
          icon: 'Grid'
        }
      }
    ]
  },
  {
    path: '/product',
    component: () => import('@/layout/index.vue'),
    name: 'product',
    redirect: '/product/brand',
    meta: {
      title: '商品管理',
      hidden: false,
      icon: 'Goods'
    },
    children: [
      {
        path: '/product/brand',
        component: () => import('@/views/product/brand/index.vue'),
        name: 'brand',
        meta: {
          title: '品牌管理',
          hidden: false,
          icon: 'ShoppingCart'
        }
      },
      {
        path: '/product/attr',
        component: () => import('@/views/product/attr/index.vue'),
        name: 'attr',
        meta: {
          title: '属性管理',
          hidden: false,
          icon: 'Operation'
        }
      },
      {
        path: '/product/spu',
        component: () => import('@/views/product/spu/index.vue'),
        name: 'spu',
        meta: {
          title: 'SPU管理',
          hidden: false,
          icon: 'Management'
        }
      },
      {
        path: '/product/sku',
        component: () => import('@/views/product/sku/index.vue'),
        name: 'sku',
        meta: {
          title: 'SKU管理',
          hidden: false,
          icon: 'Calendar'
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'Any',
    meta: {
      title: '任意路由',
      hidden: true
    }
  }
]
