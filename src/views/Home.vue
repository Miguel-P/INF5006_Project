<template>
  <div id="custom-home">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  // before create hook means it runs prior to page loading
  beforeCreate: function() {
    // this will send a get request to the web server and receive 
    // a JSON reply in repsonse.
    fetch(this.$store.state.apiUrl + '/api/user')
    // .then(res => res.json()) // this throws a JSON.parse error. Not sure why??
    .then(res => console.log(res));
  }
}
</script>
