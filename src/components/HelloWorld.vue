<template>
  <div class="hello">
   <div class="jumbotron custom-bg-dark">
  <h1 class="display-4">Todo List</h1>
  <p class="lead">Create and manage your tasks using ToDo.</p>
  <hr class="my-4">
  <p>It uses the MEVN stack and enabled Miguel to learn about express and creating database APIs using Express.</p>
  <router-link class="btn btn-primary btn-lg" to="/tasks"> View Tasks </router-link>
</div>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  }
}
</script>

