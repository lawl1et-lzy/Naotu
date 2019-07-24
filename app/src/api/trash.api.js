// import Vue from 'vue'
import axios from '@/utils/Api/Api.js'

class Api {
  // queryDirectotyForTrash
  static queryDirectotyForTrash () {
    return axios({
      method: 'POST',
      url: `/naotu/query_directory_for_trash`,
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
   // deleteFiles
   static deleteFiles (data) {
    return axios({
      method: 'POST',
      url: `/naotu/delete_files`,
      data
    })
  }
}

export default Api
