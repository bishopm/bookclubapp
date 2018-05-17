<template>
  <div class="layout-padding">
    <div v-if="profile.name" class="q-ma-md">
      <p class="text-center" v-if="!authorised">Welcome, {{profile.name}}<br><br>
        <small>(You are still waiting for one of the other members to authorise your profile)</small>
      </p>
      <p v-else class="text-center">Welcome, {{profile.name}}</p>
      <div class="row text-center">
        <div class="col">
          <router-link :to="{ name: 'books' }">
            <q-icon color="secondary" size="30pt" name="book" />
          </router-link>
          {{books}}
        </div>
        <div class="col">
          <router-link :to="{ name: 'users' }">
            <q-icon color="primary" :to="books" size="30pt" name="group" />
          </router-link>
          {{members}}
        </div>
        <div class="col">
          <router-link :to="{ name: 'comments' }">
            <q-icon color="tertiary" size="30pt" name="comment" />
          </router-link>
          {{comments}}
        </div>
      </div>
      <p class="caption text-center q-mt-lg">Top-rated books</p>
      <q-list no-border>
        <q-item v-if="rated" v-for="book in rated" :key="book.id" :to="'/books/' + book.id">
          <q-item-main>
            {{book.title}}
          </q-item-main>
          <q-item-side class="text-right">
            <q-rating readonly :value="book.avg" color="primary"></q-rating>
          </q-item-side>
        </q-item>
      </q-list>
    </div>
    <div v-else class="text-center"><q-btn @click="$router.push('/login')" color="primary" label="Welcome! Click here to login or register"/></div>
  </div>
</template>

<script>
import saveState from 'vue-save-state'
export default {
  data () {
    return {
      profile: {},
      authorised: 0,
      books: 0,
      members: 0,
      comments: 0,
      rated: []
    }
  },
  mixins: [saveState],
  methods: {
    getSaveStateConfig () {
      return {
        'cacheKey': 'BC_Home'
      }
    }
  },
  mounted () {
    if (this.$store.state.profile) {
      this.profile = this.$store.state.profile
      this.authorised = this.$store.state.profile.authorised
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.$axios.get('https://bishop.net.za/bookclub/api/public/home/' + this.$store.state.profile.id)
        .then((response) => {
          if ((response.data.authorised === 1) && (!this.registered)) {
            this.authorised = 1
            this.profile.authorised = 1
            this.$store.commit('setProfile', this.profile)
            localStorage.setItem('BC_profile', JSON.stringify(this.profile))
          }
          this.books = response.data.books
          this.members = response.data.users
          this.comments = response.data.comments
          this.rated = response.data.toprated
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }

}
</script>

<style>
</style>
