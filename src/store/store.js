import Vue from 'vue'
import Vuex from 'vuex'
import State from './state'
import Getters from './getter'
import Mutations from './mutations'
import Actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: State,
  getters: Getters,
  mutations: Mutations,
  actions: Actions
})
