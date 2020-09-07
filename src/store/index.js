import Vue from 'vue'
import Vuex from 'vuex'

import clients from './modules/clients'
import events from './modules/events'
import treatments from './modules/treatments'
import login from './modules/login'

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
    login,
  }
})
