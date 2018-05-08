import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    profile: JSON.parse(localStorage.getItem('BC_profile'))
  },
  mutations: {
    setProfile (state, newprofile) {
      state.profile = newprofile
    }
  }
})

export default store
