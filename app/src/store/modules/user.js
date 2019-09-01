import Api from '@/api/user'
// import { getToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

const state = {
  userInfo: '',
}

const mutations = {
  SET_USER_INFO: (state, payload) => {
    state.userInfo = payload.data
  }
}

const actions = {
  // get user info
  async getUserInfo({ commit }) {
    try {
      const doc = await Api.getUserInfo()
      if(doc) {
        commit('SET_USER_INFO', doc)
      }
    } catch (error) {
      console.log('getUserInfo', error)
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

