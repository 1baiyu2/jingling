import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/Home.vue'),
    // children:[
    //   {
    //     path: 'welcome',
    //     name: 'welcome',
    //     component: () => import('../views/Welcome.vue'),
    //   }
    // ]

  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
  }
]

const router = new VueRouter({
  routes
})

export default router
