import Firebase from 'firebase/app'
import 'firebase/auth'
import * as firebaseui from 'firebaseui'
import firebaseConfig from '../../firebase.conf'

export default ({ Vue }) => {
  // Initialize Firebase from settings
  Firebase.initializeApp(firebaseConfig)

  Vue.prototype.$firebase = Firebase
  Vue.prototype.$firebaseui = firebaseui
}
