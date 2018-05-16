import HelloJs from 'hellojs/dist/hello.all.min.js'
import VueHello from 'vue-hellojs'

export default ({ Vue }) => {
  HelloJs.init({
    google: '515373439888-fo6i9e0dabkiajml7ussult21fld9g82.apps.googleusercontent.com',
    facebook: '1026840700801316'
  }, {
    redirect_uri: '/bookclub/login/callback'
  })
  Vue.use(VueHello, HelloJs)
}
