<template>
  <div class="layout-padding">
    <p class="q-title text-center">Add a new book</p>
    <div class="text-center q-pa-sm">
      <q-btn v-if="!book.isbn" color="primary" @click="scanCode()" label="Scan barcode" />
    </div>
    <div class="text-center q-pa-sm">
      <img :src="book.image">
    </div>
    <div class="q-pa-sm">
      <q-input name="isbn" @blur="isbnAdded" v-model="book.isbn" type="text" float-label="ISBN / barcode" />
    </div>
    <div class="q-pa-sm">
      <q-input name="title" v-model="book.title" @keyup="checkReq" type="text" float-label="Title" />
    </div>
    <div class="q-pa-sm" v-if="authors">
      <label>Author/s</label>
      <multiselect v-model="book.authors" @input="checkReq" placeholder="Choose an author" label="name" track-by="value" :options="authorOptions" :multiple="true" :taggable="true" @tag="addAuthor"></multiselect>
    </div>
    <div class="q-pa-sm">
      <q-input v-model="book.description" type="textarea" float-label="Brief description" :max-height="100" :min-rows="5" />
    </div>
    <div class="text-center q-pa-sm">
      <q-btn-toggle v-model="book.owned" toggle-color="primary"
      :options="[{label: 'We have this book', value: 'owned'},{label: 'Wish list', value: 'wishlist'}]"/>
    </div>
    <div class="q-pa-sm" v-if="genreOptions">
      <label>Genre/s</label>
      <multiselect v-model="book.genres" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" label="name" track-by="value" :options="genreOptions" :multiple="true" :taggable="true" @tag="addTag"></multiselect>
    </div>
    <div class="text-center q-pa-sm">
      <q-btn :disable="btn_disabled" color="primary" @click="addBook()" :label="btn_msg" />
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect'
export default {
  data () {
    return {
      book: {title: '', authors: [], description: '', genres: [], isbn: '', image: '', owned: 'owned'},
      authors: [],
      authorOptions: [],
      genreOptions: [],
      btn_disabled: true,
      btn_msg: 'Title and author are compulsory fields'
    }
  },
  components: {
    Multiselect
  },
  mounted () {
    if (this.$route.params.isbn) {
      this.book.isbn = this.$route.params.isbn
      this.isbnAdded()
    }
    if (!localStorage.getItem('BC_Authors')) {
      this.$q.loading.show()
    }
    this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
    this.$axios.get(this.$store.state.hostname + '/authors')
      .then((response) => {
        for (var ukey in response.data) {
          var newitem = {
            name: response.data[ukey].surname + ', ' + response.data[ukey].firstname,
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
    this.$axios.get(this.$store.state.hostname + '/books/alltags')
      .then((response) => {
        for (var ukey in response.data) {
          var newitem = {
            name: response.data[ukey].name,
            value: response.data[ukey].id
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
    addBook () {
      this.$q.loading.show()
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.$axios.post(this.$store.state.hostname + '/books/add',
        {
          title: this.book.title,
          authors: this.book.authors,
          description: this.book.description,
          image: this.book.image.replace('http:', 'https:'),
          isbn: this.book.isbn,
          genres: this.book.genres,
          owned: this.book.owned
        })
        .then(response => {
          this.$q.loading.hide()
          if (response.data === 'Existing') {
            this.$q.notify('This book is already on your system - maybe check your wishlist?')
          } else {
            this.$q.notify('Book has been added')
          }
          this.$router.push({name: 'books'})
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
        })
    },
    checkReq () {
      if ((this.book.title.length > 2) && (this.book.authors.length > 0)) {
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
        value: newTag.substring(0, 2) + Math.floor((Math.random() * 10000000))
      }
      this.genreOptions.push(tag)
      this.book.genres.push(tag)
    },
    addAuthor (newAuthor) {
      const author = {
        name: newAuthor,
        value: -1 * Math.floor(Date.now() / 1000)
      }
      this.authorOptions.push(author)
      this.book.authors.push(author)
      this.checkReq()
    },
    scanCode () {
      this.$router.push({name: 'scanner'})
    },
    isbnAdded () {
      if (this.book.isbn.length > 5) {
        delete this.$axios.defaults.headers.common['Authorization']
        this.$axios.get('https://www.googleapis.com/books/v1/volumes?q=' + this.book.isbn + ':isbn&key=AIzaSyB48VtblZEfmSsE8l1ASs1yzs-mOFOhyI8')
          .then(response => {
            this.book.title = response.data.items[0].volumeInfo.title
            this.book.description = response.data.items[0].volumeInfo.description
            this.book.image = response.data.items[0].volumeInfo.imageLinks.thumbnail
            for (var na of response.data.items[0].volumeInfo.authors) {
              this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
              this.$axios.post(this.$store.state.hostname + '/authors',
                {
                  author: na
                })
                .then(response => {
                  if (response.data.existing) {
                    this.book.authors.push(response.data.existing)
                  } else {
                    this.authorOptions.push(response.data.new)
                    this.book.authors.push(response.data.new)
                  }
                  this.checkReq()
                })
                .catch(function (error) {
                  console.log(error)
                })
            }
          })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
