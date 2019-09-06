import axios from '@/utils/Api/Api.js'

class Api {
  static uploadImgs(data) {
    return axios({
      method: 'POST',
      url: `/uploadImgs`,
      data
    })
  }
}

export default Api
