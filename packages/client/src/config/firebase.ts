import 'firebase/firestore'
import 'firebase/auth'

import firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyCc71mgT1pZafksMQiFTINZBUgyCqbuYw0',
  authDomain: 'waves-production.firebaseapp.com',
  databaseURL: 'https://waves-production.firebaseio.com',
  projectId: 'waves-production',
  storageBucket: 'waves-production.appspot.com',
  messagingSenderId: '925572705629',
  appId: '1:925572705629:web:918de75c14314026d34cb4',
  measurementId: 'G-SVJV6T8BEB',
}

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
firebase.analytics()

export { firebase }
