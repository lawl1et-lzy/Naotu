import axios from '@/utils/Api/Api.js'

class Api {
  static funcFindById (data) {
    return axios({
      method: 'POST',
      url: `/naotu/func_findById`,
      data
    })
  }
  static funcFind () {
    return axios({
      method: 'POST',
      url: `/naotu/func_find`,
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
