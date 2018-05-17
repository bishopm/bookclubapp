<template>
  <div class="layout-padding">
    <q-tabs position="top" color="primary">
      <q-tab default slot="title" name="tab-1" icon="lock_open" label="Login"/>
      <q-tab slot="title" name="tab-2" icon="create" label="Register"/>
      <q-tab-pane class="no-border" name="tab-1">
        <div class="alert alert-danger" v-if="error">
          <p>There was an error, unable to sign in with those credentials.</p>
        </div>
        <form autocomplete="off" @submit.prevent="login" method="post">
          <div class="q-pa-sm">
            <q-input float-label="Email" type="email" v-model="email" required />
          </div>
          <div class="q-pa-sm">
            <q-input float-label="Password" type="password" v-model="password" required />
          </div>
          <div class="q-pa-sm text-center">
            <q-btn @click="login">Sign in</q-btn>
          </div>
        </form>
      </q-tab-pane>
      <q-tab-pane class="no-border" name="tab-2">
        <form autocomplete="off" @submit.prevent="login" method="post">
          <div class="q-pa-sm">
            <q-input float-label="Name" v-model="newname" required />
          </div>
          <div class="q-pa-sm">
            <q-input float-label="Email" type="email" v-model="newemail" required />
          </div>
          <div class="q-pa-sm">
            <q-input float-label="Password" type="password" v-model="newpassword" required />
          </div>
          <div class="q-pa-sm text-center">
            <q-btn @click="register">Register</q-btn>
          </div>
        </form>
      </q-tab-pane>
    </q-tabs>
  </div>
</template>

<script>
export default {
  data () {
    return {
      profile: {},
      email: '',
      password: '',
      newpassword: '',
      newemail: '',
      newname: '',
      error: 0
    }
  },
  mounted () {
    if (this.$store.state.profile) {
      this.profile = this.$store.state.profile
    }
  },
  methods: {
    login () {
      this.$axios.post('https://bishop.net.za/bookclub/api/public/login',
        {
          email: this.email,
          password: this.password
        })
        .then(response => {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.access_token
          this.profile.token = response.data.access_token
          this.$axios.post('https://bishop.net.za/bookclub/api/public/me')
            .then(response => {
              this.profile.id = response.data.id
              this.profile.name = response.data.name
              this.profile.email = response.data.email
              this.profile.authorised = response.data.authorised
              this.$store.commit('setProfile', this.profile)
              localStorage.setItem('BC_profile', JSON.stringify(this.profile))
              this.$router.push({name: 'home'})
            })
            .catch(function (error) {
              this.error = error
            })
        })
        .catch(function (error) {
          this.error = error
        })
    },
    register () {
      this.$axios.post('https://bishop.net.za/bookclub/api/public/users/register',
        {
          email: this.newemail,
          password: this.newpassword,
          name: this.newname
        })
        .then(response => {
          this.email = this.newemail
          this.password = this.newpassword
          this.login()
        })
        .catch(function (error) {
          this.error = error
        })
    }
  }
}
</script>

<style>
</style>
