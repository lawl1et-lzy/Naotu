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
}

export default Api
