class BaseResJson {
  constructor() {
  }
  /**
   * @param {*} res required
   * @param {*} error_code 
   * @param {*} error_message 
   * @param {*} hint_message 
   * @param {*} data 
   */
  emit({res, error_code = 0, error_message = '', hint_message, data}) {
    if(!res) {
      console.log('res is required in BaseResJson')
      return false
    }
    switch(error_code){
      case 0:
        hint_message = ''
        break;
      case 10001:
        hint_message = '参数错误'
        break;
      case 10002:
        hint_message = '保存失败'
        break;
      case 10001:
        hint_message = '删除失败'
        break;
      case 20000:
        hint_message = '系统错误'
        break;
    }
    let resp = {
      response: {
        error_code,
        error_message,
        hint_message,
      }
    } 
    if(data) resp.data = data
  
    res.json(resp)
  }
}

module.exports = BaseResJson