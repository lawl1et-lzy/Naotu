/**
 * 角色数据
 */
import Api from '@/api/identity.api'

let state = {
  identityInfos: [],
}


let mutations = {
  SET_IDENTITYS_INFOS: (state, payload) => {
    state.identityInfos = payload.data
  }
}

let actions = {
  async getIdentityInfos({ commit }) {
    try {
      const doc = await Api.identityFind()
      if(doc) {
        commit('SET_IDENTITYS_INFOS', doc)
      }
    } catch (error) {
      console.log('getIdentityInfos', error)
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}