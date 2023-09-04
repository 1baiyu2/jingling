import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
    beforeEnter(to, from, next) {
      // 判断是否有token  没有的话不让进入
      if (sessionStorage.getItem('token') == null) return next('/login');
      next();
    },

    children: [
      {
        path: 'welcome',
        name: 'welcome',
        component: () => import('@/views/Welcome.vue'),
      },
      {
        path: 'add',
        name: 'add',
        component: () => import('@/components/add.vue'),
      },
      {
        path: 'categories',
        name: 'categories',
        component: () => import('@/components/categories.vue'),
      }, {
        path: 'goods',
        name: 'goods',
        component: () => import('@/components/goods.vue'),
      }, {
        path: 'orders',
        name: 'orders',
        component: () => import('@/components/orders.vue'),
      }, {
        path: 'params',
        name: 'params',
        component: () => import('@/components/params.vue'),
      }, {
        path: 'reports',
        name: 'reports',
        component: () => import('@/components/reports.vue'),
      }, {
        path: 'rights',
        name: 'rights',
        component: () => import('@/components/rights.vue'),
      }, {
        path: 'roles',
        name: 'roles',
        component: () => import('@/components/roles.vue'),
      },
      {
        path: 'users',
        name: 'users',
        component: () => import('@/components/users.vue'),
      },

    ]

  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  }
];


const router = new VueRouter({
  routes
})

export default router
