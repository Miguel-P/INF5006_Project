<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <a class="navbar-brand" href="#">Navbar</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link to="/" class="nav-link" exact>
            Home
          </router-link>  
        </li>
        <li class="nav-item">
          <router-link to="/tasks" class="nav-link" exact>
            Tasks
          </router-link>  
        </li>
        <li class="nav-item">
          <router-link to="/register" class="nav-link" exact>
            Register
          </router-link>  
        </li>
        <li class="nav-item">
          <router-link to="/login" class="nav-link" exact>
            Login
          </router-link>  
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#"> Logout </a>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Username</a>
        </li>
      </ul>
      <form class="form-inline my-2 my-lg-0">
        <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>
      </form>
    </div>
  </nav>
</template>