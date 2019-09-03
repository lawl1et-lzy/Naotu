import Api from '@/api/user.api'

const state = {
  userInfo: '', // 当前个人信息
  userInfos: [], // 所有人的信息
}

const mutations = {
  SET_USER_INFO: (state, payload) => {
    state.userInfo = payload
  },
  SET_USER_INFOS: (state, payload) => {
    state.userInfos = payload
  }
}

const actions = {
  // 获取当前用户信息
  async getUserInfo({ commit }) {
    try {
      const doc = await Api.getUserInfo()
      const { response: { error_code }, data } = doc
      if(!error_code) {
        commit('SET_USER_INFO', data)
      }
    } catch (error) {
      console.log('getUserInfo', error)
    }
  },
  // 获取全部用户信息
  async getUserInfos({ commit }) {
    try {
      const doc = await Api.getUserInfos()
      const { response: { error_code }, data } = doc
      if(!error_code) {
        commit('SET_USER_INFOS', data)
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

