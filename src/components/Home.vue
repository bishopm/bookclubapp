<template>
  <div class="layout-padding">
    <div v-if="profile.name">{{profile.name}}
      <small v-if="!authorised">(Still waiting to be authorised)</small>
      <li>Who is hosting next</li>
      <li>Total number of books</li>
      <li>Total number of members</li>
      <li>Top-rated books</li>
    </div>
    <div v-else class="text-center"><q-btn @click="$router.push('/login')" color="primary" label="Welcome! Click here to register"/></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      profile: {},
      authorised: 0
    }
  },
  mounted () {
    if (this.$store.state.profile) {
      this.profile = this.$store.state.profile
      this.authorised = this.$store.state.profile.authorised
      if (!this.authorised) {
        this.$axios.get('http://localhost/bookclub/public/users/' + this.$store.state.profile.id)
          .then((response) => {
            if (response.data.authorised === 1) {
              this.authorised = 1
              this.profile.authorised = 1
              this.$store.commit('setProfile', this.profile)
              localStorage.setItem('BC_profile', JSON.stringify(this.profile))
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  }

}
</script>

<style>
</style>
