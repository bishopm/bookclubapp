<template>
  <div v-if="book" class="text-center layout-padding">
    <p class="caption">
      {{book.title}}&nbsp;<q-icon @click.native="editbook" name="edit"/><br>
      <img :src="book.image">
    </p>
    <span v-for="author in book.authors" :key="author.id">
      <router-link :to="{ name: 'author', params: { id: author.id } }">
        <small>{{author.firstname}} {{author.surname}}</small>
      </router-link><br>
    </span>
    <div v-if="book.tags">
      <q-chip style="margin-right:5px;" dense square icon="turned_in" color="secondary" v-for="tag in book.tags" :key="tag.id">
        <router-link :to="{ name: 'genre', params: { tag: tag.slug }}" class="text-white" style="text-decoration:none;">
          {{tag.name}}
        </router-link>
      </q-chip>
    </div>
    <q-rating v-if="book.avg" readonly :value="book.avg" color="tertiary"></q-rating>
    <p class="q-ma-md text-justify">{{book.description}}</p>
    <p class="q-ma-md" v-if="book.status">
      {{book.status.user.name}} has this book <small>({{book.status.loandate}} - )</small>
      <q-btn class="q-mt-md" v-if="book.status.user.id != profile.id" color="primary">I have the book now</q-btn>
      <q-btn @click="returnbook" class="q-mt-lg" v-else color="primary">Return this book now</q-btn>
    </p>
    <p v-else-if="book.owned">
      <q-btn class="q-mt-md" @click="borrow" color="secondary">Borrow this book now</q-btn>
    </p>
    <p class="caption">Comments</p>
    <q-field multiline>
      <q-input v-model="newcomment" :after="[{icon: 'add', handler: addComment}]" class="full-width bg-white" type="textarea" float-label="Add a comment/rating" :max-height="30" :min-rows="3" />
      <q-rating v-if="book.unrated" v-model="newrating" color="black"></q-rating>
    </q-field>
    <q-list no-border v-if="comments">
      <q-item v-for="comment in comments" :key="comment.id">
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
      book: {},
      profile: {},
      today: '',
      comments: [],
      newcomment: '',
      newrating: 0
    }
  },
  methods: {
    addComment () {
      if ((this.comment) || (this.rating)) {
        this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
        this.$axios.post(this.$store.state.hostname + '/books/addcomment',
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
      }
    },
    deletecomment (id) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.$axios.post(this.$store.state.hostname + '/books/deletecomment/' + id)
        .then((response) => {
          this.refreshdata()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    borrow () {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.$axios.post(this.$store.state.hostname + '/loans/add',
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
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.$axios.post(this.$store.state.hostname + '/loans/update',
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
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.today = new Date().toISOString().substr(0, 10)
      this.profile = this.$store.state.profile
      this.$axios.get(this.$store.state.hostname + '/books/' + this.$route.params.id + '/' + this.profile.id)
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
