import axios from '@/utils/Api/Api.js'

class Api {
  static funcFind (data) {
    return axios({
      method: 'POST',
      url: `/naotu/func_find`,
      data
    })
  }
  static funcCreate (data) {
    return axios({
      method: 'POST',
      url: `/naotu/func_create`,
      data
    })
  }
  static funcUpdate (data) {
    return axios({
      method: 'POST',
      url: `/naotu/func_update`,
      data
    })
  }
  static funcRemove (data) {
    return axios({
      method: 'POST',
      url: `/naotu/func_remove`,
      data
    })
  }
}

export default Api
