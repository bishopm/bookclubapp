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
      <label class="typo__label">Author/s</label>
      <multiselect v-model="book.authors" placeholder="Choose an author" label="label" track-by="code" :options="selectOptions" :multiple="true"></multiselect>
    </div>
    <div class="q-pa-sm" v-if="book.author_id==-1">
      <q-input v-model="book.newsurname" @keyup="checkReq" type="text" float-label="Surname" />
      <q-input v-model="book.newfirstname" @keyup="checkReq" type="text" float-label="First name" />
    </div>
    <div class="q-pa-sm">
      <q-input v-model="book.description" type="textarea" float-label="Brief description" :max-height="30" :min-rows="3" />
    </div>
    <div class="q-pa-sm" v-if="genreOptions">
      <label class="typo__label">Genre/s</label>
      <multiselect v-model="book.genres" tag-placeholder="Add this as new tag" placeholder="Search or add a tag" label="name" track-by="code" :options="genreOptions" :multiple="true" :taggable="true" @tag="addTag"></multiselect>
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
      book: {title: '', authors: [], newauthor: '', genres: [], isbn: ''},
      authors: [],
      selectOptions: [{label: 'New author (enter below)', value: -1}],
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
    this.$axios.get('http://localhost/bookclub/public/authors')
      .then((response) => {
        for (var ukey in response.data) {
          var newitem = {
            label: response.data[ukey].surname + ', ' + response.data[ukey].firstname,
            value: response.data[ukey].id
          }
          this.selectOptions.push(newitem)
        }
        this.$q.loading.hide()
      })
      .catch(function (error) {
        console.log(error)
        this.$q.loading.hide()
      })
    this.$axios.get('http://localhost/bookclub/public/books/alltags')
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
    addBook () {
      this.$q.loading.show()
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
      this.$axios.post('http://localhost/bookclub/public/books/add',
        {
          title: this.book.title,
          author_id: this.book.author_id,
          newauthor: this.book.newauthor,
          description: this.book.description,
          genres: this.book.genres
        })
        .then(response => {
          this.$q.loading.hide()
          this.$q.notify('Book has been added')
          this.$router.push('books')
        })
        .catch(function (error) {
          console.log(error)
          this.$q.loading.hide()
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
      this.book.genres.push(tag)
    },
    scanCode () {
      this.$router.push({name: 'scanner'})
    },
    isbnAdded () {
      delete this.$axios.defaults.headers.common['Authorization']
      this.$axios.get('https://www.googleapis.com/books/v1/volumes?q=' + this.book.isbn + ':isbn&key=AIzaSyB48VtblZEfmSsE8l1ASs1yzs-mOFOhyI8')
        .then(response => {
          this.book.title = response.data.items[0].volumeInfo.title
          this.book.description = response.data.items[0].volumeInfo.description
          this.book.image = response.data.items[0].volumeInfo.imageLinks.thumbnail
          for (var na of response.data.items[0].volumeInfo.authors) {
            this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
            this.$axios.post('http://localhost/bookclub/public/authors',
              {
                author: na
              })
              .then(response => {
                this.book.authors.push(response.data)
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
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
