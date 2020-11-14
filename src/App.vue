<template>
  <div id="app">
    <sidebar-menu
        :menu="menu"
        :show-one-child="true"
        :collapsed="true"
        @toggle-collapse="onToggleCollapse"
        @item-click="onItemClick" />
    <router-view :data="getData()"/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    methods: {
      created () {
        this.collapsed = true
      },
      getData(){ },
      onToggleCollapse (collapsed) {
        this.collapsed = collapsed
      },
      onItemClick (event, item) {
        console.log('onItemClick')
        console.log(event)
        console.log(item)
      },
      filter: function() {
        console.log("add name")
      }
    },
    data() {
      return {
        loading: true,
        menu: [
          {
            header: true,
            title: 'Finance Dashboard',
            hiddenOnCollapse: true
          },
          {
            href: '/about',
            title: 'About',
            icon: 'fa fa-info-circle'
          },
          {
            href: '/',
            title: 'Dashboard',
            icon: 'fa fa-chart-area'
          },
          {
            href: '/betatables',
            title: 'Beta Tables',
            icon: 'fa fa-table'
          },
          {
            href: '/indexmetrics',
            title: 'Index Metrics',
            icon: 'fa fa-chart-bar'
          },
          {
            href: '/downloads',
            title: 'Downloads',
            icon: 'fa fa-download',
          }
        ]
      }
    }
  }
</script>

<style>
  @import './assets/css/style.css';
  @import './assets/css/templatemo-style.css';
</style>