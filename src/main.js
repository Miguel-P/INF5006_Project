import Vue from 'vue'
import App from './App.vue'

import VueSidebarMenu from 'vue-sidebar-menu'
// import the es6 version
import 'zingchart/es6'
import ZingChartVue from 'zingchart-vue'
import ZingGrid from 'zinggrid'
import VueRouter from 'vue-router'

import Dashboard from './views/finance/Dashboard.vue'
import DownloadsTab from './views/finance/DownloadsTab.vue'

import 'vue-sidebar-menu/dist/vue-sidebar-menu.css'
import 'vue-search-select/dist/VueSearchSelect.css'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'

import router from './router'

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)
Vue.use(VueSidebarMenu)
Vue.component('zinggrid', ZingGrid)
Vue.component('zingchart', ZingChartVue)
Vue.config.productionTip = false

// const router = new VueRouter({
//   routes: [
//     {
//       path: '/',
//       name: 'Home',
//       component: Dashboard
//     },
//     {
//       path: '/downloads',
//       name: 'Downloads',
//       component: DownloadsTab
//     }
//   ]
// })

new Vue({
  router,
  render: h => h(App),
  methods: {
    addName: function() {
      console.log("add name")
    }
  }
}).$mount('#app')
