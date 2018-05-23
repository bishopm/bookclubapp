<template>
  <div></div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  mounted () {
    localStorage.removeItem('BC_loginStatus')
    localStorage.removeItem('BC_profile')
    localStorage.removeItem('BC_Home')
    localStorage.removeItem('BC_Authors')
    localStorage.removeItem('BC_Books')
    localStorage.removeItem('BC_Comments')
    localStorage.removeItem('BC_Genres')
    localStorage.removeItem('BC_Users')
    this.$store.commit('setLogin', 'false')
    this.$store.commit('setProfile', '{}')
    this.$router.push({name: 'login'})
    window.location.reload(false)
  }
}
</script>

<style>
</style>
