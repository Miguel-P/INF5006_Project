import Vue from 'vue'
import App from './App.vue'

import VueSidebarMenu from 'vue-sidebar-menu'
import ZingChartVue from 'zingchart-vue'
import ZingGrid from 'zinggrid'
import VueRouter from 'vue-router'

import Dashboard from './views/finance/Dashboard.vue'

import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'

Vue.use(VueRouter)
Vue.use(VueSidebarMenu)
Vue.component('zinggrid', ZingGrid)
Vue.component('zingchart', ZingChartVue)
Vue.config.productionTip = false

const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    }
  ]
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
