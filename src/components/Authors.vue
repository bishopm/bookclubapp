<template>
  <q-list>
    <p class="caption text-center">All authors</p>
    <q-search class="q-ml-md" @input="searchdb" v-model="search" placeholder="search by author" />
    <q-item v-if="authors" v-for="author in authors" :key="author.id" :to="'/authors/' + author.id">
      <q-item-main>
        {{author.author}} ({{author.books.length}})
      </q-item-main>
    </q-item>
  </q-list>
</template>

<script>
import saveState from 'vue-save-state'
export default {
  data () {
    return {
      authors: [],
      search: ''
    }
  },
  props: ['token'],
  mixins: [saveState],
  methods: {
    getSaveStateConfig () {
      return {
        'cacheKey': 'BC_Authors'
      }
    },
    searchdb () {
      this.$axios.post('http://localhost/bookclub/public/authors/search',
        {
          search: this.search
        })
        .then(response => {
          this.authors = response.data
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    }
  },
  mounted () {
    if (!localStorage.getItem('BC_Authors')) {
      this.$q.loading.show()
    }
    this.$axios.get('http://localhost/bookclub/public/authors')
      .then((response) => {
        this.authors = response.data
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
