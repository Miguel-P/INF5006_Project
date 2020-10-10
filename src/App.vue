<template>
  <div id="app">

    <router-view :data="getData()"/>
  </div>
</template>

<script>
  export default {
    name: 'App',
    methods: {
      created () {
  
      },
      getData(){ },
    },
    data() {
      return {
      }
    }
  }
</script>

  @import './assets/css/style.css';
</style>
