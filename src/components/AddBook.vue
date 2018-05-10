<template>
  <div class="layout-padding">
    <p class="q-title text-center">Add a new book</p>
    <div class="q-pa-sm">
      <q-input name="title" v-model="book.title" @keyup="checkReq" type="text" float-label="Title" />
    </div>
    <div class="q-pa-sm" v-if="authors">
      <q-select name="author_id" filter @blur="checkReq" filter-placeholder="Search..." float-label="Author" autofocus-filter v-model="book.author_id" :options="selectOptions" />
    </div>
    <div class="q-pa-sm" v-if="book.author_id==-1">
      <q-input v-model="book.newauthor" @keyup="checkReq" type="text" float-label="Surname, first name" />
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
      book: {title: '', author_id: 0, newauthor: '', genres: []},
      authors: [],
      selectOptions: [{label: 'New author (enter below)', value: -1}],
      genreOptions: [],
      btn_disabled: true,
      btn_msg: 'Title and author are compulsory fields'
    }
  },
  props: ['token'],
  components: { Multiselect },
  mounted () {
    if (!localStorage.getItem('BC_Authors')) {
      this.$q.loading.show()
    }
    this.$axios.get('https://bishop.net.za/bookclub/api/public/authors')
      .then((response) => {
        for (var ukey in response.data) {
          var newitem = {
            label: response.data[ukey].author,
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
    this.$axios.get('https://bishop.net.za/bookclub/api/public/books/alltags')
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
      this.$axios.post('https://bishop.net.za/bookclub/api/public/books/add',
        {
          title: this.book.title,
          author_id: this.book.author_id,
          newauthor: this.book.newauthor,
          description: this.book.description,
          genres: this.book.genres
        })
        .then(response => {
          this.$router.push('books')
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
      this.book.genres.push(tag)
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
