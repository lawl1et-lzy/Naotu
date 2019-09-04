import axios from '@/utils/Api/Api.js'

class Api {
  static login(data) {
    return axios({
      method: 'POST',
      url: `/naotu/login`,
      data
    })
  }

  static loginout() {
    return axios({
      method: 'POST',
      url: `/naotu/loginout`,
    })
  }

  static getUserInfo() {
    return axios({
      method: 'POST',
      url: `/naotu/user_identity_userConnectFunc`
    })
  }

  static getUsersInfo() {
    return axios({
      method: 'POST',
      url: `/naotu/get_users_info`
    })
  }
}

export default Api
