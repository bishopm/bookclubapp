<template>
  <div class="layout-padding text-center">
    <div v-if="loggedIn">
      You are logged in as {{loggedIn.name}}
      <div v-if="profile">
        <h3>{{profile.displayName}}</h3>
        <img v-if="profile.image" :src="profile.image.url" />
      </div>
    </div>
    <div v-else>
      <h4>Login using Google or Facebook</h4>
      <q-btn icon="google" @click="auth('google')">Google</q-btn>
      <q-btn icon="facebook" @click="auth('facebook')">Facebook</q-btn>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      profile: {},
      loggedIn: '',
      authRes: {}
    }
  },
  props: ['token'],
  mounted () {
    this.loggedIn = this.$store.state.profile
  },
  methods: {
    auth (network) {
      const hello = this.hello
      hello(network).login().then(() => {
        hello(network).api('/me')
          .then((json) => {
            this.profile.name = json['displayName']
            this.profile.image = json['image']['url']
            this.profile.provider_id = json['id']
            this.profile.provider = network
            this.$axios.post('http://localhost/bookclub/public/login',
              {
                name: this.profile.name,
                provider_id: this.profile.provider_id,
                provider: this.profile.provider,
                image: this.profile.image
              })
              .then(response => {
                this.profile.id = response.data.id
                this.profile.authorised = response.data.authorised
                this.$store.commit('setProfile', this.profile)
                localStorage.setItem('BC_profile', JSON.stringify(this.profile))
                this.loggedIn = this.$store.state.profile
              })
              .catch(function (error) {
                console.log(error)
              })
          })
      })
    }
  }
}
</script>

<style>
</style>
