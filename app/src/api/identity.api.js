import axios from '@/utils/Api/Api.js'

class Api {
  static identityFind (data) {
    return axios({
      method: 'POST',
      url: `/naotu/identity_find`,
      data
    })
  }
  static identityCreate (data) {
    return axios({
      method: 'POST',
      url: `/naotu/identity_create`,
      data
    })
  }
  static identityUpdate (data) {
    return axios({
      method: 'POST',
      url: `/naotu/identity_update`,
      data
    })
  }
  static identityRemove (data) {
    return axios({
      method: 'POST',
      url: `/naotu/identity_remove`,
      data
    })
  }
}

export default Api
