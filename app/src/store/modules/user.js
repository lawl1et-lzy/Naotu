import Api from '@/api/user.api'
// import { getToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

const state = {
  userInfo: '', // 当前个人信息
  userInfos: [], // 所有人的信息
}

const mutations = {
  SET_USER_INFO: (state, payload) => {
    state.userInfo = payload.data
  },
  SET_USER_INFOS: (state, payload) => {
    state.userInfos = payload.data
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
  // get user info
  async getUserInfos({ commit }) {
    try {
      const doc = await Api.getUserInfos()
      if(doc) {
        commit('SET_USER_INFOS', doc)
      }
    } catch (error) {
      console.log('getUserInfos', error)
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

