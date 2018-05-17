<template>
  <div class="layout-padding">
    <p class="q-title text-center">Edit an author</p>
    <div class="q-pa-sm">
      <q-input name="firstname" v-model="author.firstname" @keyup="checkReq" type="text" float-label="First name" />
    </div>
    <div class="q-pa-sm">
      <q-input name="surname" v-model="author.surname" @keyup="checkReq" type="text" float-label="Surname" />
    </div>
    <div class="text-center q-pa-sm">
      <q-btn :disable="btn_disabled" color="primary" @click="updateAuthor('update')" label="OK" />
      <q-btn v-if="author.books" :disable="author.books.length > 0" color="red" @click="confirmDelete" label="Delete this author" />
    </div>
    <div class="text-center q-mt-md" v-if="author.books"><span class="caption">Books linked to this author</span>
      <p v-for="book in author.books" :key="book.id">
        <router-link :to="{ name: 'book', params: {id: book.id} }">{{book.title}}</router-link></p>
      <p><small>To delete this author, first remove or update the books above</small></p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      author: {id: 0, firstname: '', surname: ''},
      btn_disabled: false
    }
  },
  mounted () {
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
    this.$axios.get('https://bishop.net.za/bookclub/api/public/authors/' + this.$route.params.id)
      .then((response) => {
        this.author = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    confirmDelete () {
      this.$q.dialog({
        title: 'Delete a book',
        message: 'Are you sure you want to delete this author?',
        ok: 'Yes, delete',
        cancel: 'Cancel'
      }).then(() => {
        this.updateAuthor('delete')
      }).catch(() => {
        this.$q.notify('Deletion cancelled')
      })
    },
    updateAuthor (action) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.$axios.post('https://bishop.net.za/bookclub/api/public/authors/' + action + '/' + this.author.id,
        {
          firstname: this.author.firstname,
          surname: this.author.surname
        })
        .then(response => {
          if (response.data !== 'deleted') {
            this.$q.notify('Author has been updated')
          } else {
            this.$q.notify('Author has been deleted')
          }
          this.$router.push({ name: 'authors' })
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    checkReq () {
      if ((this.author.surname.length > 2) || (this.author.firstname > 2)) {
        this.btn_disabled = false
        this.btn_msg = 'OK'
      } else {
        this.btn_disabled = true
        this.btn_msg = 'Either firstname or surname is compulsory'
      }
    }
  }
}
</script>

<style>
</style>
