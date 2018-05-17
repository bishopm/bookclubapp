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
    this.$store.commit('setProfile', null)
    localStorage.setItem('BC_profile', '')
    this.$router.push({name: 'home'})
  }
}
</script>

<style>
</style>
