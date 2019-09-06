import axios from '@/utils/Api/Api.js'

class Api {
  static login(data) {
    return axios({
      method: 'POST',
      url: `/login`,
      data
    })
  }

  static loginout() {
    return axios({
      method: 'POST',
      url: `/loginout`
    })
  }

  static getUserInfo() {
    return axios({
      method: 'POST',
      url: `/user_identity_userConnectFunc`
    })
  }

  static getUsersInfo() {
    return axios({
      method: 'POST',
      url: `/get_users_info`
    })
  }
}

export default Api
