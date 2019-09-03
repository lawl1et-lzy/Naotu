/**
 * 功能数据
 */
import Api from '@/api/func.api'

let state = {
  funcInfos: [],
}


let mutations = {
  SET_FUNC_INFOS: (state, payload) => {
    state.funcInfos = payload.data
  }
}

let actions = {
  async getFuncInfos({ commit }) {
    try {
      const doc = await Api.funcFind()
      if(doc) {
        commit('SET_FUNC_INFOS', doc)
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