<template>
  <div class="layout-padding">
    <div v-if="$route.params.action" class="q-mx-md q-mt-md text-center caption">
      {{$route.params.action.toUpperCase()}} MEMBER
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.firstname.$error" error-label="The firstname field is required">
        <q-input float-label="First name" v-model="form.firstname" @blur="$v.form.firstname.$touch()" :error="$v.form.firstname.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.surname.$error" error-label="The surname field is required">
        <q-input float-label="Surname" v-model="form.surname" @blur="$v.form.surname.$touch()" :error="$v.form.surname.$error" />
      </q-field>
    </div>
    <div class="q-ma-md">
      <q-field :error="$v.form.phone.$error" error-label="Phone numbers must be numeric">
        <q-input float-label="Cellphone" v-model="form.phone" @blur="$v.form.phone.$touch()" :error="$v.form.phone.$error" />
      </q-field>
    </div>
    <div class="q-ma-md text-center">
      <q-btn color="primary" @click="submit">OK</q-btn>
      <q-btn class="q-ml-md" color="secondary" @click="$router.back()">Cancel</q-btn>
      <q-btn v-if="$route.params.action === 'editadd'" class="q-ml-md" color="red">Delete</q-btn>
    </div>
  </div>
</template>

<script>
import { required, numeric } from 'vuelidate/lib/validators'
// https://github.com/monterail/vuelidate/tree/master/src/validators
export default {
  data () {
    return {
      form: {
        surname: '',
        firstname: '',
        phone: '',
        id: ''
      }
    }
  },
  validations: {
    form: {
      surname: { required },
      firstname: { required },
      phone: { numeric }
    }
  },
  methods: {
    submit () {
      this.$v.form.$touch()
      if (this.$v.form.$error) {
        this.$q.notify('Please check for errors!')
      } else {
        if (this.$route.params.action === 'edit') {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
          this.$axios.post(this.$store.state.hostname + '/users/' + this.form.id,
            {
              surname: this.form.surname,
              firstname: this.form.firstname,
              phone: this.form.phone
            })
            .then(response => {
              this.$q.notify('Member successfully updated')
              this.$router.push({ name: 'users' })
            })
            .catch(function (error) {
              console.log(error)
              this.$q.loading.hide()
            })
        } else {
          this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.$store.state.profile.token
          this.$axios.post(this.$store.state.hostname + '/users',
            {
              surname: this.form.surname,
              firstname: this.form.firstname,
              phone: this.form.phone,
              authorised: 1
            })
            .then(response => {
              this.$q.notify('Member added')
              this.$router.push({ name: 'users' })
            })
            .catch(function (error) {
              console.log(error)
              this.$q.loading.hide()
            })
        }
      }
    }
  },
  mounted () {
    if (this.$route.params.action === 'edit') {
      this.form = JSON.parse(this.$route.params.user)
    }
  }
}
</script>

<style>
  a {
    text-decoration: none;
    color:white;
  }
</style>
