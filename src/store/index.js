import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    profile: {},
    // hostname: 'http://localhost/bookclub/public'
    hostname: 'https://bishop.net.za/bookclub/api/public'
  },
  mutations: {
    setProfile (state, newprofile) {
      state.profile = newprofile
    },
    setLogin (state, newstatus) {
      state.loginStatus = newstatus
    }
  }
})

export default store
