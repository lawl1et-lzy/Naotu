// import Vue from 'vue'
import axios from '@/utils/Api/Api.js'

class Api {
  // addFile
  static addFile(data) {
    return axios({
      method: 'POST',
      url: `/add_file`,
      data
    })
  }
  // addDirectory
  static addDirectory(data) {
    return axios({
      method: 'POST',
      url: `/add_directory`,
      data
    })
  }
  // update
  static updateFile(data) {
    return axios({
      method: 'POST',
      url: `/update`,
      data
    })
  }
  // del 脑图
  static delFile(data) {
    return axios({
      method: 'POST',
      url: `/del`,
      data
    })
  }
  // rm 脑图
  static rmFile(data) {
    return axios({
      method: 'POST',
      url: `/rm`,
      data
    })
  }
  // queryFile
  static queryFile(data) {
    return axios({
      method: 'POST',
      url: `/query_file`,
      data
    })
  }
  // queryDirectoty
  static queryDirectoty(data) {
    return axios({
      method: 'POST',
      url: `/query_directory`,
      data
    })
  }
  // 获取 ROOT_ID
  static getRootid(data) {
    return axios({
      method: 'POST',
      url: `/get_root_id`,
      data
    })
  }
  // 重命名
  static rename(data) {
    return axios({
      method: 'POST',
      url: `/rename`,
      data
    })
  }
}

export default Api
