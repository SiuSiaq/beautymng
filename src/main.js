import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage'
import privateConfig from '../privateConfig'

Vue.config.productionTip = false

const firebaseInitConfig = privateConfig.config.firebase

firebase.initializeApp({
  apiKey: firebaseInitConfig.apiKey,
  authDomain: firebaseInitConfig.authDomain,
  databaseURL: firebaseInitConfig.databaseURL,
  projectId: firebaseInitConfig.projectId,
  storageBucket: firebaseInitConfig.storageBucket,
  messagingSenderId: firebaseInitConfig.messagingSenderId,
  appId: firebaseInitConfig.appId,
  measurementId: firebaseInitConfig.measurementId
})

export const db = firebase.firestore();
export const auth = firebase.auth();
export const storageRef = firebase.storage().ref();
export const increment = firebase.firestore.FieldValue.increment(1);
export const decrement = firebase.firestore.FieldValue.increment(-1);
export const changeValue = (amount) => firebase.firestore.FieldValue.increment(amount);
export let uid = null;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
