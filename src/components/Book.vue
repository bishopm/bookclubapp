<template>
  <div v-if="book" class="text-center layout-padding">
    <p class="caption">
      {{book.title}} <small>{{book.author.author}}&nbsp;<q-icon @click.native="editbook" name="edit"/></small>
    </p>
    <q-chip style="margin-right:5px;" dense square icon="turned_in" color="primary" v-for="tag in book.tags" :key="tag.id">
      <router-link :to="{ name: 'genre', params: { tag: tag.slug }}" class="text-white" style="text-decoration:none;">
        {{tag.name}}
      </router-link>
    </q-chip>
    <p class="q-mt-md">{{book.description}}</p>
    <q-rating v-if="book.avg" readonly :value="book.avg" color="red"></q-rating>
    <p v-if="book.status">
      {{book.status.user.name}} has this book ({{book.status.loandate}} - )

      <q-btn class="q-mt-md" v-if="book.status.user.id != profile.id" color="primary">I have the book now</q-btn>
      <q-btn @click="returnbook" class="q-mt-lg" v-else color="primary">Return this book now</q-btn>
    </p>
    <p v-else>
      <q-btn class="q-mt-md" @click="borrow" color="primary">Borrow this book now</q-btn>
    </p>
    <h3>Comments</h3>
    <q-field multiline>
      <q-input v-model="newcomment" :after="[{icon: 'add', handler: addComment}]" class="full-width bg-white" type="textarea" float-label="Add a comment/rating" :max-height="30" :min-rows="3" />
      <q-rating v-if="book.unrated" v-model="newrating" color="red"></q-rating>
    </q-field>
    <q-list no-border v-if="comments">
      <q-item v-for="comment in comments" :key="comment.id">
        <q-item-side :avatar="comment.user.image"/>
        <q-item-main>
          <small>
            <b>{{comment.user.name}}</b> {{comment.created_at.slice(0,10)}}<br>
            <q-rating v-if="comment.rate" readonly :value="comment.rate" color="primary"></q-rating>
            <br>{{comment.comment}}
            <q-icon @click.native="deletecomment(comment.id)" name="delete" v-if="comment.user.id == profile.id"/><br>
          </small>
        </q-item-main>
      </q-item>
    </q-list>
  </div>
</template>

<script>
export default {
  data () {
    return {
      book: '',
      profile: {},
      today: '',
      comments: [],
      newcomment: '',
      newrating: 0
    }
  },
  props: ['token'],
  methods: {
    addComment () {
      this.$axios.post('https://bishop.net.za/bookclub/api/public/books/addcomment',
        {
          user_id: this.profile.id,
          book_id: this.book.id,
          comment: this.newcomment,
          rating: this.newrating
        })
        .then(response => {
          this.refreshdata()
          this.newcomment = ''
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    deletecomment (id) {
      this.$axios.post('https://bishop.net.za/bookclub/api/public/books/deletecomment/' + id)
        .then((response) => {
          this.refreshdata()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    borrow () {
      this.$axios.post('https://bishop.net.za/bookclub/api/public/loans/add',
        {
          loandate: this.today,
          user_id: this.profile.id,
          book_id: this.book.id
        })
        .then(response => {
          this.refreshdata()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    editbook () {
      this.$router.push({ name: 'editbook', params: {id: this.book.id} })
    },
    returnbook () {
      this.$axios.post('https://bishop.net.za/bookclub/api/public/loans/update',
        {
          returndate: this.today,
          id: this.book.status.id
        })
        .then(response => {
          this.refreshdata()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    refreshdata () {
      this.today = new Date().toISOString().substr(0, 10)
      this.profile = this.$store.state.profile
      this.$axios.get('https://bishop.net.za/bookclub/api/public/books/' + this.$route.params.id + '/' + this.profile.id)
        .then((response) => {
          this.book = response.data
          this.comments = this.book.comments
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
