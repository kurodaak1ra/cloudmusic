import { HIDE_WIN } from './actions-type'
import { SET_WINDOWS } from './mutation-type.js'

export default {
  [HIDE_WIN]({ commit }) {
    commit(SET_WINDOWS, ['mask', false])
    commit(SET_WINDOWS, ['left', false])
    commit(SET_WINDOWS, ['list', false])
    commit(SET_WINDOWS, ['info', false])
    commit(SET_WINDOWS, ['simple', null])
  }
}
