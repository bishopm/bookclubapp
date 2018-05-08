<template>
  <div v-if="user" class="text-center layout-padding">
    <p class="caption">{{user.name}} <small>{{user.email}}</small></p>
    <img width="50%" :src="user.image">
    <div v-if="user.authorised">
      <q-list no-border class="q-mt-lg">
        <q-list-header>Books on loan</q-list-header>
        <q-item v-for="loan in user.loans" :key="loan.id" v-if="loan.returndate==null">
          <q-item-main>{{loan.book.title}} <small>(borrowed on {{loan.loandate}})</small></q-item-main>
        </q-item>
      </q-list>
    </div>
    <div v-else class="q-pa-lg">
      <q-btn @click="updateuser('authorise')" class="q-mt-lg" color="primary">Authorise this user</q-btn>
      <q-btn @click="updateuser('delete')" class="q-mt-lg" color="red">Delete this user</q-btn>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      user: {}
    }
  },
  methods: {
    refreshdata () {
      this.$axios.get('http://localhost/bookclub/public/users/' + this.$route.params.id)
        .then((response) => {
          this.user = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    updateuser (action) {
      this.$axios.post('http://localhost/bookclub/public/users/authorise/' + this.user.id,
        {
          action: action
        })
        .then(response => {
          this.refreshdata()
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
