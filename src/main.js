import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage'

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: "AIzaSyDZuwNnftQPQX4mcf-UwLIOjxE0HC88KYk",
  authDomain: "beutymng.firebaseapp.com",
  databaseURL: "https://beutymng.firebaseio.com",
  projectId: "beutymng",
  storageBucket: "beutymng.appspot.com",
  messagingSenderId: "728645110661",
  appId: "1:728645110661:web:226b79631083a9148a52ec",
  measurementId: "G-J7R1N5H844"
})

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storageRef = firebase.storage().ref();
export const increment = firebase.firestore.FieldValue.increment(1);
export const decrement = firebase.firestore.FieldValue.increment(-1);
export let uid = null;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
