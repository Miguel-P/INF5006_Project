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
    margin-left: 30px;
  }

  .loader {  /* Loader Div Class */
    justify-content: center;
    position: absolute;
    top:0px;
    right:0px;
    width:100%;
    height:100%;
    background-color:#300;
    background-size: 50px;
    background-repeat:no-repeat;
    background-position:center;
    z-index:10000000;
    opacity: 0.8;
    filter: alpha(opacity=40);
  }

  .loader div {
    justify-content: center;
    display: inline-block;
    margin-top: 20%;
  }

  .green{
    color: white;
    background: green;
  }

  .red{
    color: white;
    background: red;
  }

  .orange{
    color: white;
    background: orange;
  }

  .w100 {
      width: 100%;
  }

  .w60 {
      width: 60%;
  }

  .w40 {
      width: 40%;
  }

  .w20 {
      width: 20%;
  }

  .horizontal div {
      display: inline-block;
      margin: 2px;
  }

  .horizontal-no-margin div {
      display: inline-block;
  }
</style>
