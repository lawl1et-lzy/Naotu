const Mongoose = require('mongoose');
class BaseUtil {
  // 判断是否是对象
  isObject (param) {
    return param && !Array.isArray(param) && param instanceof Object
  }
  // 格式化成 MongoDB 查询支持的_id
  async formatToObjectId(_id)  {
    try {
      return await Mongoose.Types.ObjectId(_id)
    } catch (error) {
      console.log('BaseUtil formatToObjectId', error)
    }
  }
}


module.exports = BaseUtil