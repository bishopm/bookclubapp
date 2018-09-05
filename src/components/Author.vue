<template>
  <div v-if="author" class="layout-padding">
    <p class="caption text-center">{{author.firstname}} {{author.surname}}&nbsp;<q-icon @click.native="editauthor" name="edit"/></p>
    <q-list v-if="author.books" class="no-border">
      <q-item v-if="author.books.length > 0" v-for="book in author.books" :key="book.id" :to="'/books/' + book.id">
        <q-item-main>
          {{book.title}}<br>
          <q-rating v-if="book.avg" readonly :value="book.avg" color="primary"></q-rating>
        </q-item-main>
        <q-item-side>
          <small v-if="book.status"><span v-if="book.status.user">{{book.status.user.firstname}}</span></small>
          <small v-else-if="book.owned">Available</small>
        </q-item-side>
      </q-item>
      <q-item v-if="!author.books.length" class="text-center"><small>Author has no books listed and can be safely deleted</small></q-item>
    </q-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      author: []
    }
  },
  props: ['token'],
  methods: {
    refreshdata () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.$axios.get(this.$store.state.hostname + '/authors/' + this.$route.params.id)
        .then((response) => {
          this.author = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    editauthor () {
      this.$router.push({ name: 'editauthor', params: {id: this.author.id} })
    }
  },
  mounted () {
    this.refreshdata()
  }

}
</script>

<style>
</style>
