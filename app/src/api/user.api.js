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
      url: `/naotu/get_user_info`
    })
  }

  static getUserInfos() {
    return axios({
      method: 'POST',
      url: `/naotu/get_user_infos`
    })
  }
}

export default Api
