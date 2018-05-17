<template>
  <q-list v-if="authorised">
    <p class="caption text-center">All members</p>
    <q-item v-if="users" v-for="user in users" :key="user.id" :to="'/users/' + user.id">
      <q-item-main>
        <b>{{user.name}}</b>&nbsp;<small>{{user.email}}</small><br>
        <small v-if="user.authorised==0">New user - click to authorise</small>
      </q-item-main>
    </q-item>
  </q-list>
  <div class="q-pa-sm" v-else>Sorry, you don't have permission to see others users yet</div>
</template>

<script>
import saveState from 'vue-save-state'
export default {
  data () {
    return {
      users: [],
      authorised: ''
    }
  },
  props: ['token'],
  mixins: [saveState],
  methods: {
    getSaveStateConfig () {
      return {
        'cacheKey': 'BC_Users'
      }
    }
  },
  mounted () {
    this.authorised = this.$store.state.profile.authorised
    if (!localStorage.getItem('BC_Users')) {
      // this.$q.loading.show()
    }
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
    this.$axios.get('https://bishop.net.za/bookclub/api/public/users')
      .then((response) => {
        this.users = response.data
        // this.$q.loading.hide()
      })
      .catch(function (error) {
        console.log(error)
        // this.$q.loading.hide()
      })
  }
}
</script>

<style>
</style>
