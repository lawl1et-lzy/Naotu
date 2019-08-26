const apiWhiteList = require('../api/whitelist.api.js');
// 不在白名单中，执行session验证
const validateSession = (req, res, next) => {
  if(Array.isArray(apiWhiteList) && apiWhiteList.length > 0) {
    if(!~apiWhiteList.findIndex(item => item === req.originalUrl)) {
      let user = req.session.user
      if(!user) {
        let resp = {
          response: {
            error_code: '403',
            error_message: 'unSign',
            hint_message: '未登录'
          }
        }
        res.json(resp)
      }
    }
  }
  next()
}

module.exports = {
  validateSession
}
