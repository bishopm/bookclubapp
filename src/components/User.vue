<template>
  <div v-if="user" class="text-center layout-padding">
    <p class="caption">{{user.name}} <small>{{user.email}}</small></p>
    <div v-if="user.authorised">
      <q-list no-border class="q-mt-lg">
        <q-list-header>Books on loan</q-list-header>
        <q-item v-for="loan in user.loans" :key="loan.id" v-if="loan.returndate==null" :to="'/books/' + loan.book.id">
          <q-item-main>{{loan.book.title}} <small>(borrowed on {{loan.loandate}})</small></q-item-main>
        </q-item>
      </q-list>
      <q-list no-border class="q-mt-lg">
        <q-list-header>History</q-list-header>
        <q-item v-for="hloan in user.loans" :key="hloan.id" v-if="hloan.returndate!==null" :to="'/books/' + hloan.book.id">
          <q-item-main>{{hloan.book.title}} <small>(returned on {{hloan.returndate}})</small></q-item-main>
        </q-item>
      </q-list>
    </div>
    <div v-if="!authorised" class="q-pa-lg">
      <q-btn @click="updateuser('authorise')" class="q-mt-lg" color="primary">Authorise this user</q-btn>
      <q-btn @click="updateuser('delete')" class="q-mt-lg" color="red">Delete this user</q-btn>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {},
      authorised: 1
    }
  },
  methods: {
    refreshdata () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.$axios.get(this.$store.state.hostname + '/users/' + this.$route.params.id)
        .then((response) => {
          this.user = response.data
          this.authorised = this.user.authorised
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    updateuser (action) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.$axios.post(this.$store.state.hostname + '/users/authorise/' + this.user.id,
        {
          action: action
        })
        .then(response => {
          this.$q.notify('User authorised')
          this.$router.push({ name: 'users' })
        })
        .catch(function (error) {
          console.log(error)
        })
    }

  },
  mounted () {
    this.refreshdata()
  }

}
</script>

<style>
</style>
