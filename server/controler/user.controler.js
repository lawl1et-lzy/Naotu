require('../db/model/user.model.js')
const MD5 = require('md5.js')
const Mongoose = require('mongoose');
const modelUser = Mongoose.model('user');

// 生成账号
// const createAccount = async (username, password) => {
//   const md5pwd = new MD5().update(password).digest('hex')
//   let userModel = new modelUser({
//     username,
//     password: md5pwd
//   })
//   await userModel.save()
// }

// createAccount('niya', '123456')

// 登录
const login = async (req, res, next) => {
  let { username, password } = req.body
  if(!username) responseJson({res, error_code: 10001, hint_message: '用户名不正确'})
  if(!password) responseJson({res, error_code: 10003, hint_message: '密码不能为空'})
  const md5pwd = new MD5().update(password).digest('hex')
  const userDoc = await modelUser.findOne({ username })
  if(userDoc) {
    if(md5pwd === userDoc.password) {
      let { username, _id } = userDoc
      let user = {username, token: _id}
      req.session.user = user
      res.cookie("user", JSON.stringify(user), {
        path: '/',
        maxAge: 7 * 24 * 3600 * 1000
      })
      responseJson({res, data: {username, token: _id}})
    } else {
      responseJson({res, error_code: 10004, hint_message: '密码不正确'})
    }
  } else {
    responseJson({res, error_code: 10005, hint_message: '暂无此用户'})
  }
}

// 登出
const loginout = async (req, res, next) => {
  req.session.user = null
  res.cookie('user', '', {
    path:"/",
    maxAge:-1
  })
  responseJson({res})
}

/**
 * @param {*} res 
 * @param {*} error_code 
 * @param {*} error_message 
 * @param {*} hint_message 
 * @param {*} data 
 */
let responseJson = ({res, error_code = 0, error_message = '', hint_message, data}) => {
  switch(error_code){
    case 0:
      hint_message = ''
      break;
    case 10002:
      hint_message = '用户尚未登录'
      break;
    case 10001:
      hint_message = '参数错误'
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


module.exports = {
  login,
  loginout
}