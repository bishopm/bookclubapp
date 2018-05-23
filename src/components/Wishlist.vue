<template>
  <div>
    <q-list class="no-border">
      <p class="caption text-center">Wishlist</p>
      <q-item v-if="books" v-for="book in books" :key="book.id" :to="'/books/' + book.id">
        <q-item-main>
          {{book.title}}<br>
          <small><span v-for="author in book.authors" :key="author.id"><i>{{author.firstname}} {{author.surname}}</i><br></span></small>
        </q-item-main>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import saveState from 'vue-save-state'
export default {
  data () {
    return {
      books: [],
      search: ''
    }
  },
  mixins: [saveState],
  methods: {
    getSaveStateConfig () {
      return {
        'cacheKey': 'BC_Wishlist'
      }
    }
  },
  mounted () {
    if (!localStorage.getItem('BC_Books')) {
      this.$q.loading.show()
    }
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
    this.$axios.get(this.$store.state.hostname + '/books/wishlist')
      .then(response => {
        this.books = response.data
        this.$q.loading.hide()
      })
      .catch(function (error) {
        console.log(error)
        this.$q.loading.hide()
      })
  }

}
</script>

<style>
</style>
