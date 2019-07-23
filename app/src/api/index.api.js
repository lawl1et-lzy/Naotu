// import Vue from 'vue'
import axios from '@/utils/Api/Api.js'

class Api {
  // addFile
  static addFile (data) {
    return axios({
      method: 'POST',
      url: `/naotu/add_file`,
      data
    })
  }
  // addDirectory
  static addDirectory (data) {
    return axios({
      method: 'POST',
      url: `/naotu/add_directory`,
      data
    })
  }
  // update
  static updateFile (data) {
    return axios({
      method: 'POST',
      url: `/naotu/update`,
      data
    })
  }
  // del 脑图
  static delFile (data) {
    return axios({
      method: 'POST',
      url: `/naotu/del`,
      data
    })
  }
  // rm 脑图
  static rmFile (data) {
    return axios({
      method: 'POST',
      url: `/naotu/rm`,
      data
    })
  }
  // queryFile
  static queryFile (data) {
    return axios({
      method: 'POST',
      url: `/naotu/query_file`,
      data
    })
  }
  // queryDirectoty
  static queryDirectoty (data) {
    return axios({
      method: 'POST',
      url: `/naotu/query_directory`,
      data
    })
  }
  // 获取 ROOT_GUID
  static getRootGuid (data) {
    return axios({
      method: 'POST',
      url: `/naotu/get_root_guid`,
      data
    })
  }
  // 重命名
  static rename (data) {
    return axios({
      method: 'POST',
      url: `/naotu/rename`,
      data
    })
  }
}

export default Api
