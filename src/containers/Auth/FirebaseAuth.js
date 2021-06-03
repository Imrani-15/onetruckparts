import firebase from 'firebase';


let firebaseConfig = {
    apiKey: "AIzaSyBN6JBQ7OXwXNWC3EkZxC2et0CMTd91IEA",
    authDomain: "onetruckpartscom.firebaseapp.com",
    projectId: "onetruckpartscom",
    storageBucket: "onetruckpartscom.appspot.com",
    messagingSenderId: "200627911533",
    appId: "1:200627911533:web:f8ef05ccbb3e10426bf864",
    measurementId: "G-NSE0V4RM8P"
  }


const FirebaseAuth = firebase.initializeApp(firebaseConfig)

export default FirebaseAuth;
  