<template>
  <div>
    <q-list class="no-border">
      <p class="caption text-center">All books</p>
      <q-search class="q-ml-md" @input="searchdb" v-model="search" placeholder="search by title" />
      <q-item v-if="books" v-for="book in books" :key="book.id" :to="'/books/' + book.id">
        <q-item-main>
          {{book.title}}<br>
          <small><span v-for="author in book.authors" :key="author.id"><i>{{author.firstname}} {{author.surname}}</i><br></span></small>
        </q-item-main>
        <q-item-side class="text-right">
          <small v-if="book.status">{{book.status.user.name}}</small>
          <small v-else>Available</small>
          <small v-if="book.avg">
            <br><q-rating readonly :value="book.avg" color="primary"></q-rating>
          </small>
        </q-item-side>
      </q-item>
    </q-list>
    <q-btn round color="primary" @click="addBook" class="fixed" icon="add" style="right: 18px; bottom: 68px" />
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
        'cacheKey': 'BC_Books'
      }
    },
    addBook () {
      this.$router.push({name: 'addbook'})
    },
    searchdb () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.$axios.post(this.$store.state.hostname + '/books/search',
        {
          search: this.search
        })
        .then(response => {
          this.books = response.data
          this.$q.loading.hide()
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    }
  },
  mounted () {
    if (!localStorage.getItem('BC_Books')) {
      this.$q.loading.show()
    }
    this.searchdb()
  }

}
</script>

<style>
</style>
