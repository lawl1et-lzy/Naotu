class BaseUtil {
  isObject (param) {
    return param && !Array.isArray(param) && param instanceof Object
  }
}


module.exports = BaseUtil