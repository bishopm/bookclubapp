<template>
  <div v-if="author" class="layout-padding">
    <p class="caption text-center">{{author.firstname}} {{author.surname}}&nbsp;<q-icon @click.native="editauthor" name="edit"/></p>
    <q-list class="no-border">
      <q-item v-if="author.books" v-for="book in author.books" :key="book.id" :to="'/books/' + book.id">
        <q-item-main>
          {{book.title}}<br>
          <q-rating v-if="book.avg" readonly :value="book.avg" color="primary"></q-rating>
        </q-item-main>
        <q-item-side>
          <small v-if="book.status">{{book.status.user.name}}</small>
          <small v-else>Available</small>
        </q-item-side>
      </q-item>
      <p v-else-if="!author.books.length" class="text-center"><small>Author has no books listed and can be safely deleted</small></p>
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
      this.$axios.get('https://bishop.net.za/bookclub/api/public/authors/' + this.$route.params.id)
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
