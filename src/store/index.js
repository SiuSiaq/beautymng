import Vue from 'vue'
import Vuex from 'vuex'

import clients from './modules/clients'
import events from './modules/events'
import treatments from './modules/treatments'
import products from './modules/products'
import login from './modules/login'
import salon from './modules/salon'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    clients,
    events,
    treatments,
    products,
    login,
    salon,
  }
})
