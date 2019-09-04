import Api from '@/api/user.api'

const state = {
  userInfo: '', // 当前个人信息
  usersInfo: [], // 所有人的信息
}

const mutations = {
  SET_USER_INFO: (state, payload) => {
    state.userInfo = payload
  },
  SET_USERS_INFO: (state, payload) => {
    state.usersInfo = payload
  }
}

const actions = {
  // 获取当前用户信息
  async getUserInfo() {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = await Api.getUserInfo()
        const { response, data } = doc
        if(response && !response.error_code) {
          resolve(data)
        }
      } catch (error) {
        reject(error)
        console.log('getUserInfoa', error)
      }
    })
  },
  // async getUserInfo({ commit }) {
  //   try {
  //     const doc = await Api.getUserInfo()
  //     const { response, data } = doc
  //     if(response && !response.error_code) {
  //       commit('SET_USER_INFO', data)
  //     }
  //   } catch (error) {
  //     console.log('getUserInfo', error)
  //   }
  // },
  // 设置用户信息
  async setUserInfo({ commit }, payload) {
    commit('SET_USER_INFO', payload)
  },
  // 获取全部用户信息
  async getUsersInfo({ commit }) {
    try {
      const doc = await Api.getUsersInfo()
      const { response, data } = doc
      if(response && !response.error_code) {
        commit('SET_USERS_INFO', data)
      }
    } catch (error) {
      console.log('getUsersInfo', error)
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

