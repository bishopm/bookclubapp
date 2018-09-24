import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    profile: {},
    hostname: 'http://localhost/bookclub/public'
    // hostname: 'https://bookclub.bishop.net.za/api/public'
  },
  mutations: {
    setProfile (state, newprofile) {
      state.profile = newprofile
    },
    setLogin (state, newstatus) {
      state.loginStatus = newstatus
    },
    setToken (state, newtoken) {
      state.token = newtoken
    }
  }
})

export default store
