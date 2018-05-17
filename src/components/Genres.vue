<template>
  <div>
    <q-list class="no-border">
      <p class="caption text-center">All genres</p>
      <q-item v-if="genres" v-for="genre in genres" :key="genre.slug" :to="'/genre/' + genre.slug">
        <q-item-main>
          {{genre.name}} ({{genre.count}})
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
      genres: []
    }
  },
  mixins: [saveState],
  methods: {
    getSaveStateConfig () {
      return {
        'cacheKey': 'BC_Genres'
      }
    }
  },
  mounted () {
    if (!localStorage.getItem('BC_Genres')) {
      // this.$q.loading.show()
    }
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
    this.$axios.get('https://bishop.net.za/bookclub/api/public/books/alltags')
      .then((response) => {
        this.genres = response.data
        // this.$q.loading.hide()
      })
      .catch(function (error) {
        console.log(error)
        // this.$q.loading.hide()
      })
  }

}
</script>

<style>
</style>
