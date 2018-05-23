<template>
  <div class="layout-padding">
    <p class="q-title text-center">Edit a book</p>
    <div class="q-pa-sm">
      <q-input name="title" v-model="book.title" @keyup="checkReq" type="text" float-label="Title" />
    </div>
    <div class="q-pa-sm text-center">
      <img :src="book.image" />
      <q-input v-model="book.image" type="text" float-label="Image (url)" />
    </div>
    <div class="q-pa-sm">
      <label>Author/s</label>
      <multiselect v-model="authors" placeholder="Choose an author" label="label" track-by="value" :options="authorOptions" :multiple="true"></multiselect>
    </div>
    <div class="q-pa-sm">
      <q-input v-model="book.isbn" type="text" float-label="ISBN / barcode" />
    </div>
    <div class="q-pa-sm">
      <q-input v-model="book.description" type="textarea" float-label="Description" :max-height="100" :min-rows="5" />
    </div>
    <div class="text-center q-pa-sm">
      <q-btn-toggle v-model="book.owned" toggle-color="primary" :options="ownedOptions"/>
    </div>
    <div class="q-pa-sm" v-if="genreOptions">
      <label>Genre/s</label>
      <multiselect v-model="genres" tag-placeholder="Add this as new genre" placeholder="Search or add a tag" label="name" track-by="code" :options="genreOptions" :multiple="true" :taggable="true" @tag="addTag"></multiselect>
    </div>
    <div class="text-center q-pa-sm">
      <q-btn :disable="btn_disabled" color="primary" @click="updateBook('update')" :label="btn_msg" />
      <q-btn :disable="btn_disabled" color="red" @click="confirmDelete" label="Delete this book" />
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
export default {
  data () {
    return {
      book: {},
      authorOptions: [],
      btn_disabled: false,
      genres: [],
      genreOptions: [],
      ownedOptions: [
        {label: 'We have this book', value: 'owned'},
        {label: 'On the wishlist', value: 'wishlist'}
      ],
      btn_msg: 'OK',
      authors: []
    }
  },
  components: { Multiselect },
  mounted () {
    if (!localStorage.getItem('BC_Authors')) {
      this.$q.loading.show()
    }
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
    this.$axios.get(this.$store.state.hostname + '/authors')
      .then((response) => {
        for (var ukey in response.data) {
          var newitem = {
            label: response.data[ukey].surname + ', ' + response.data[ukey].firstname,
            value: response.data[ukey].id
          }
          this.authorOptions.push(newitem)
        }
        this.$q.loading.hide()
      })
      .catch(function (error) {
        console.log(error)
        this.$q.loading.hide()
      })
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
    this.$axios.get(this.$store.state.hostname + '/books/' + this.$route.params.id)
      .then((response) => {
        this.book = response.data
        for (var ukey in this.book.tags) {
          var newitem = {
            name: this.book.tags[ukey].name,
            code: this.book.tags[ukey].id
          }
          this.genres.push(newitem)
        }
        for (var ukey2 in this.book.authors) {
          var newitem2 = {
            label: response.data.authors[ukey2].surname + ', ' + response.data.authors[ukey2].firstname,
            value: response.data.authors[ukey2].id
          }
          this.authors.push(newitem2)
        }
      })
      .catch(function (error) {
        console.log(error)
      })
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
    this.$axios.get(this.$store.state.hostname + '/books/alltags')
      .then((response) => {
        for (var ukey in response.data) {
          var newitem = {
            name: response.data[ukey].name,
            code: response.data[ukey].id
          }
          this.genreOptions.push(newitem)
        }
        this.$q.loading.hide()
      })
      .catch(function (error) {
        console.log(error)
        this.$q.loading.hide()
      })
  },
  methods: {
    confirmDelete () {
      this.$q.dialog({
        title: 'Delete a book',
        message: 'Are you sure you want to delete this book?',
        ok: 'Yes, delete',
        cancel: 'Cancel'
      }).then(() => {
        this.updateBook('delete')
      }).catch(() => {
        this.$q.notify('Deletion cancelled')
      })
    },
    updateBook (action) {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.$axios.post(this.$store.state.hostname + '/books/' + action + '/' + this.book.id,
        {
          title: this.book.title,
          isbn: this.book.isbn,
          image: this.book.image,
          authors: this.authors,
          description: this.book.description,
          genres: this.genres,
          owned: this.book.owned
        })
        .then(response => {
          if (response.data !== 'deleted') {
            this.$q.notify('Book has been updated')
            this.$router.push({ name: 'book', params: {id: this.book.id} })
          } else {
            this.$q.notify('Book has been deleted')
            this.$router.push({ name: 'books' })
          }
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    checkReq () {
      if ((this.book.title.length > 2) && ((this.book.author_id > 0) || (this.book.newauthor.length > 2))) {
        this.btn_disabled = false
        this.btn_msg = 'OK'
      } else {
        this.btn_disabled = true
        this.btn_msg = 'Title and author are compulsory fields'
      }
    },
    addTag (newTag) {
      const tag = {
        name: newTag,
        code: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      this.genreOptions.push(tag)
      this.genres.push(tag)
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
