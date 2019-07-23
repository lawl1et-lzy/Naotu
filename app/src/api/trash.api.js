// import Vue from 'vue'
import axios from '@/utils/Api/Api.js'

class Api {
  // queryDirectotyForTrash
  static queryDirectotyForTrash (data) {
    return axios({
      method: 'POST',
      url: `/naotu/query_directory_for_trash`,
      data
    })
  }
  // revertFiles
  static revertFiles (data) {
    return axios({
      method: 'POST',
      url: `/naotu/revert_files`,
      data
    })
  }
}

export default Api
