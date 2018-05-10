<template>
  <div v-if="author" class="layout-padding">
    <p class="caption text-center">{{author.author}}</p>
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
      this.$axios.get('https://bishop.net.za/bookclub/api/public/authors/' + this.$route.params.id)
        .then((response) => {
          this.author = response.data
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
