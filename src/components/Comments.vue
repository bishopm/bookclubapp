<template>
  <div>
    <q-list class="no-border">
      <p class="caption text-center">All comments</p>
      <q-item v-if="comments" v-for="comment in comments" :key="comment.id" :to="'/books/' + comment.commentable.id">
        <q-item-main>
          <b>{{comment.commented.name}}</b> commented on <i>{{comment.commentable.title}}</i> on {{comment.created_at.slice(0,10)}}
        </q-item-main>
        <q-item-side class="text-right">
        </q-item-side>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import saveState from 'vue-save-state'
export default {
  data () {
    return {
      comments: [],
      search: ''
    }
  },
  mixins: [saveState],
  methods: {
    getSaveStateConfig () {
      return {
        'cacheKey': 'BC_Comments'
      }
    }
  },
  mounted () {
    if (!localStorage.getItem('BC_Comments')) {
      this.$q.loading.show()
    }
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
    this.$axios.get('https://bishop.net.za/bookclub/api/public/comments')
      .then(response => {
        this.comments = response.data
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
