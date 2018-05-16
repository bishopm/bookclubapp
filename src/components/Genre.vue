<template>
  <div class="layout-padding">
    <p v-if="tagname" class="caption text-center">{{tagname.toUpperCase()}}</p>
    <q-list class="no-border">
      <q-item v-if="books" v-for="book in books" :key="book.id" :to="'/books/' + book.id">
        <q-item-main>
          {{book.title}} <small>{{book.author.author}}</small>
        </q-item-main>
      </q-item>
    </q-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      books: [],
      tagname: this.$route.params.tag
    }
  },
  props: ['token'],
  methods: {
    refreshdata () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.$axios.get('http://localhost/bookclub/public/genre/' + this.$route.params.tag)
        .then((response) => {
          this.books = response.data
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
