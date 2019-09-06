import axios from '@/utils/Api/Api.js'

class Api {
  static userIdentityFind() {
    return axios({
      method: 'POST',
      url: `/user_identity_find`
    })
  }
  static userIdentityFindById(data) {
    return axios({
      method: 'POST',
      url: `/user_identity_findById`,
      data
    })
  }
  static userIdentityCreate(data) {
    return axios({
      method: 'POST',
      url: `/user_identity_create`,
      data
    })
  }
  static userIdentityUpdate(data) {
    return axios({
      method: 'POST',
      url: `/user_identity_update`,
      data
    })
  }
  static userIdentityRemove(data) {
    return axios({
      method: 'POST',
      url: `/user_identity_remove`,
      data
    })
  }
}

export default Api
