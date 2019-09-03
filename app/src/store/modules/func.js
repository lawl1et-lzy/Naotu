/**
 * 功能数据
 */
import Api from '@/api/func.api'

let state = {
  funcInfos: [],
}


let mutations = {
  SET_FUNC_INFOS: (state, payload) => {
    state.funcInfos = payload
  }
}

let actions = {
  async getFuncInfos({ commit }) {
    try {
      const doc = await Api.funcFind()
      const { response: { error_code }, data } = doc
      if(!error_code) {
        commit('SET_FUNC_INFOS', data)
      }
    } catch (error) {
      console.log('getFuncInfos', error)
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}