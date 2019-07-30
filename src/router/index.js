import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

let router = new Router({
  mode: 'hash',
  routes: [
    {
        path: '/home',
        name: 'home',
        component: () => import("@/views/Home/Home")
    },
    {
      path: '*',
      component: () => import("@/views/Home/Home")
  }
]
})
router.beforeEach((to, from, next) => {
  next();
})
export default router
