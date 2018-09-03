<template>
  <q-list>
    <p class="caption text-center">All members</p>
    <q-btn round color="primary" @click="addUser" class="fixed" icon="add" style="right: 18px; top: 68px" />
    <q-item v-if="users" v-for="user in users" :key="user.id" :to="'/users/' + user.id">
      <q-item-main class="text-center">
        <b>{{user.firstname}} {{user.surname}}</b><br>
        <small v-if="user.comments.length">{{user.comments.length}} comments<br></small>
        <small v-if="user.authorised==0">New user - click to authorise</small>
      </q-item-main>
    </q-item>
  </q-list>
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
    },
    addUser () {
      this.$router.push({name: 'userform', params: { action: 'add' }})
    }
  },
  mounted () {
    this.authorised = this.$store.state.profile.authorised
    if (!localStorage.getItem('BC_Users')) {
      this.$q.loading.show()
    }
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
    this.$axios.get(this.$store.state.hostname + '/users')
      .then((response) => {
        this.users = response.data
        this.$q.loading.hide()
      })
      .catch(function (error) {
        console.log(error)
        this.$q.loading.hide()
      })
  }
}
</script>

<style>
</style>
