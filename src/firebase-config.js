import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'


const firebaseConfig = {
  apiKey: "AIzaSyATFMQyLgdJGNbEg1E8jeUwPPiW8ucS3bk",
  authDomain: "beerauth-development.firebaseapp.com",
  projectId: "beerauth-development",
  storageBucket: "beerauth-development.appspot.com",
  messagingSenderId: "166719172898",
  appId: "1:166719172898:web:fe26720f6481ff29cf357b"
};

firebase.initializeApp(firebaseConfig)

const auth = firebase.auth();
const fs = firebase.firestore();
const storage = firebase.storage();

export {auth, fs, storage}

