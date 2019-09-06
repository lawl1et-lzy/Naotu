import axios from '@/utils/Api/Api.js'

class Api {
  static identityFuncFind() {
    return axios({
      method: 'POST',
      url: `/identity_func_find`
    })
  }
  static identityFuncFindById(data) {
    return axios({
      method: 'POST',
      url: `/identity_func_findById`,
      data
    })
  }
  static identityFuncCreate(data) {
    return axios({
      method: 'POST',
      url: `/identity_func_create`,
      data
    })
  }
  static identityFuncUpdate(data) {
    return axios({
      method: 'POST',
      url: `/identity_func_update`,
      data
    })
  }
  static identityFuncRemove(data) {
    return axios({
      method: 'POST',
      url: `/identity_func_remove`,
      data
    })
  }
}

export default Api
