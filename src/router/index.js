import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/finance/Dashboard.vue'
import Downloads from '../views/finance/DownloadsTab.vue'

Vue.use(VueRouter)

const isLoggedIn = false;

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    // component: () => import(/* webpackChunkName: "about" */ './../components/Navbar.vue'),
    // component: () => import(/* webpackChunkName: "about" */ './../views/finance/Dashboard.vue')
  },
  {
    path: '/downloads',
    name: 'Downloads',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ './../views/finance/DownloadsTab.vue')
  }
  // {
  //   path: '/login',
  //   name: "login",
  //   component: Login,
  //   beforeEnter: (to, from, next) => {
  //     if (!isLoggedIn){
  //       next();
  //     }
  //     else {
  //       next("/");
  //     }
  //   }
  // },
  // {
  //   path: '/tasks',
  //   name: 'TasksAll',
  //   component: TasksAll,
  //   beforeEnter: (to, from, next) => {
  //     if (isLoggedIn){
  //       next();
  //     }
  //     else {
  //       next('/login');
  //     }
  //   }
  // },
  // {
  //   path: '/tasks/new',
  //   name: 'TasksCreate',
  //   component: TasksCreate,
  //   beforeEnter: (to, from, next) => {
  //     if (isLoggedIn){
  //       next();
  //     }
  //     else {
  //       next("/login");
  //     }
  //   }
  // },
  // {
  //   path: '/tasks/:id',
  //   name: 'TasksEdit',
  //   component: TasksEdit,
  //   beforeEnter: (to, from, next) => {
  //     if (isLoggedIn){
  //       next();
  //     }
  //     else {
  //       next("/login");
  //     }
  //   }
  // },
  // {
  //   path: '/register',
  //   name: "registration",
  //   component: Register,
  //   beforeEnter: (to, from, next) => {
  //     if (isLoggedIn){
  //       next("/");
  //     }
  //     else {
  //       next();
  //     }
  //   }
  // },
  // {
  //   path: '*',
  //   redirect: '/'
  // }

]

const router = new VueRouter({
  routes,
  linkActiveClass: 'active', // have to do this because there's a clash between the bootstrap active class and the naming convention of the "active" class used automatically by Vue
  linkExactActiveClass: 'exact-active',
  mode: 'history' // to delete the hash in the website url
})

export default router
