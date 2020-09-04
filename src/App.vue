<template>
  <div id="app">
    <ul v-if="errors && errors.length">
      <li v-for="error of errors"  v-bind:key="error">
        {{error.message}}
      </li>
    </ul>
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
      }
    },
    data() {
      return {
        menu: [
          {
            header: true,
            title: 'Finance Dashboard',
            hiddenOnCollapse: true
          },
          {
            href: '/',
            title: 'Dashboard',
            icon: 'fa fa-table'
          },
          {
            href: '/piecharts',
            title: 'Pie Charts',
            icon: 'fa fa-chart-pie'
          },
          {
            href: '/linecharts',
            title: 'Line Charts',
            icon: 'fa fa-chart-area',
          }
        ]
      }
    }
  }
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 20px;
  }
</style>
