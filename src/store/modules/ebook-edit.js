/**
 * 纸谱编辑的状态
 */
import * as types from '../mutation-types'

const state = {
  ebookInfo: {}
}

const mutations = {
  [types.EBOOK_EDIT] (state, ebook) {
    state.ebookInfo = ebook
  }
}

export default {
  state,
  mutations
}
