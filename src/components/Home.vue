<template>
  <div class="layout-padding">
    <div v-if="$store.state.loginStatus" class="q-ma-md">
      <div v-if="$store.state.profile.authorised">
        <p class="text-center">Welcome, {{profile.firstname}}</p>
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
    </div>
    <div v-if="!$store.state.profile.authorised" class="text-center">Your phone number has been verified. We're just waiting for another member to authorise you</div>
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
    if (localStorage.getItem('BC_loginStatus') === 'true') {
      this.$store.commit('setLogin', localStorage.getItem('BC_loginStatus'))
      this.$store.commit('setProfile', JSON.parse(localStorage.getItem('BC_profile')))
    } else if (localStorage.getItem('BC_VerifiedPhone')) {
      this.$axios.post(this.$store.state.hostname + '/login',
        {
          phone: localStorage.getItem('BC_VerifiedPhone'),
          phonetoken: localStorage.getItem('BC_Phonetoken')
        })
        .then(response => {
          localStorage.setItem('BC_Token', response.data.token)
          this.$store.commit('setToken', response.data.token)
          this.profile.id = response.data.id
          this.profile.firstname = response.data.firstname
          this.profile.surname = response.data.surname
          this.profile.authorised = response.data.authorised
          this.profile.token = response.data.token
          this.$store.commit('setProfile', this.profile)
          if (response.data.authorised === 1) {
            this.$store.commit('setLogin', 'true')
            localStorage.setItem('BC_loginStatus', 'true')
          } else {
            this.$store.commit('setLogin', 'false')
            localStorage.setItem('BC_loginStatus', 'false')
          }
          localStorage.setItem('BC_profile', JSON.stringify(this.profile))
        })
        .catch(function (error) {
          console.log(error)
        })
    } else {
      this.$router.push({name: 'phoneverification'})
    }
    if (this.$store.state.profile) {
      this.authorised = this.$store.state.profile.authorised
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.profile = this.$store.state.profile
      this.$axios.get(this.$store.state.hostname + '/home/' + this.$store.state.profile.id)
        .then((response) => {
          if ((response.data.authorised === 1) && (!this.authorised)) {
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
