import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '../services/AuthService'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLoggedIn: false,
    apiURL: 'https://localhost:3000',
    username: null,
    userID: null
  },
  // mutations are the set of functions which actually change your state
  // mutations are called by actions
  mutations: {
    authenticate(state) {
      state.isLoggedIn = auth.isLoggedIn();
      if (state.isLoggedIn) {
        state.username = auth.getUsername();
        state.userID = auth.getUserID();
      } else {
        state.username = null;
        state.userID = null;
      }
    }
  },
  // .commit is how to call a mutation
  actions: {
    authenticate(context) {
      context.commit('authenticate'); // this will call a function in mutate, i.e. the set of functions that changes the state
    }
  },
  modules: {
  }
})
