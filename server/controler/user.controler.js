const MD5 = require('md5.js')
const UserDao = require('../dao/user.dao.js')
const userDao = new UserDao();
const Mongoose = require('mongoose');
// 登录
const login = async (req, res, next) => {
  try {
    let { username, password } = req.body
    if(!username) responseJson({res, error_code: 10001, hint_message: '用户名不正确'})
    if(!password) responseJson({res, error_code: 10002, hint_message: '密码不能为空'})
    const md5pwd = new MD5().update(password).digest('hex')
    const userDoc = await userDao.findOne({ username })
    if(userDoc) {
      if(md5pwd === userDoc.password) {
        let { username, id } = userDoc
        let user = {username, userid: id}
        req.session.user = user
        res.cookie("user", JSON.stringify(user), {
          path: '/',
          maxAge: 7 * 24 * 3600 * 1000
        })
        responseJson({res, data: {username, userid: id}})
      } else {
        responseJson({res, error_code: 10003, hint_message: '密码不正确'})
      }
    } else {
      responseJson({res, error_code: 10004, hint_message: '暂无此用户'})
    }
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
  }
}

// 获取用户基本信息
const getUserInfo = async (req, res) => {
  try {
    const { userid } = JSON.parse(req.cookies.user)
    const data = await userDao.findOne({
      id: userid
    }, { 
      _id: 0,
      realname: 1,
      id: 1,
      username: 1
    })
    responseJson({res, data})
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
  }
}

// const user = {
//   username: 'niya',
//   password: new MD5().update('123456').digest('hex'),
//   realname: '尼亚'
// }

// userDao.create(user)

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
const responseJson = ({res, error_code = 0, error_message = '', hint_message, data}) => {
  switch(error_code){
    case 0:
      hint_message = ''
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
  loginout,
  getUserInfo
}