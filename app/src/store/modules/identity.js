/**
 * 角色数据
 */
import Api from '@/api/identity.api'

let state = {
  identityInfos: [],
}


let mutations = {
  SET_IDENTITYS_INFOS: (state, payload) => {
    state.identityInfos = payload
  }
}

let actions = {
  async getIdentityInfos({ commit }) {
    try {
      const doc = await Api.identityFind()
      const { response: { error_code }, data } = doc
      if(!error_code) {
        commit('SET_IDENTITYS_INFOS', data)
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