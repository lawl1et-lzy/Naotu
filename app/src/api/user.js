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

  static userinfo(data) {
    return axios({
      method: 'POST',
      url: `/naotu/userinfo`,
      data
    })
  }
}

export default Api
