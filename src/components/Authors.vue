<template>
  <q-list>
    <p class="caption text-center">All authors</p>
    <q-search class="q-ml-md" @input="searchdb" v-model="search" placeholder="search by author" />
    <div v-if="authors">
      <q-item v-for="author in authors" :key="author.id" :to="'/authors/' + author.id">
        <q-item-main v-if="author.books">
          {{author.surname}}, {{author.firstname}} ({{author.books.length}})
        </q-item-main>
      </q-item>
    </div>
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
  mixins: [saveState],
  methods: {
    getSaveStateConfig () {
      return {
        'cacheKey': 'BC_Authors'
      }
    },
    searchdb () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.$axios.post(this.$store.state.hostname + '/authors/search',
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
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
    this.$axios.get(this.$store.state.hostname + '/authors')
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
