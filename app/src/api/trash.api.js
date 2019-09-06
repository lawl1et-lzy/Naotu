// import Vue from 'vue'
import axios from '@/utils/Api/Api.js'

class Api {
  static querySelfDirectotyForTrash() {
    return axios({
      method: 'POST',
      url: `/query_self_directory_for_trash`
    })
  }
  static revertFiles(data) {
    return axios({
      method: 'POST',
      url: `/revert_files`,
      data
    })
  }
  static deleteFiles(data) {
    return axios({
      method: 'POST',
      url: `/delete_files`,
      data
    })
  }
}

export default Api
