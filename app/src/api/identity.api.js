import axios from '@/utils/Api/Api.js'

class Api {
  static identityFind() {
    return axios({
      method: 'POST',
      url: `/identity_find`
    })
  }
  static identityFindById(data) {
    return axios({
      method: 'POST',
      url: `/identity_findById`,
      data
    })
  }
  static identityCreate(data) {
    return axios({
      method: 'POST',
      url: `/identity_create`,
      data
    })
  }
  static identityUpdate(data) {
    return axios({
      method: 'POST',
      url: `/identity_update`,
      data
    })
  }
  static identityRemove(data) {
    return axios({
      method: 'POST',
      url: `/identity_remove`,
      data
    })
  }
}

export default Api
