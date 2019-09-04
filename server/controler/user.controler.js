const MD5 = require('md5.js')
const UserDao = require('../dao/user.dao.js')
const userDao = new UserDao();
const BaseResJson = require('../util/baseResJson.js');
let resJson = new BaseResJson();

// 登录
const login = async (req, res, next) => {
  try {
    let { username, password } = req.body
    if(!username) resJson.emit({res, error_code: 10001, hint_message: '用户名不正确'})
    if(!password) resJson.emit({res, error_code: 10002, hint_message: '密码不能为空'})
    const md5pwd = new MD5().update(password).digest('hex')
    const userDoc = await userDao.findOne({ username })
    if(userDoc) {
      if(md5pwd === userDoc.password) {
        let { username, _id } = userDoc
        let user = {username, userid: _id}
        req.session.user = user
        res.cookie("user", JSON.stringify(user), {
          path: '/',
          maxAge: 7 * 24 * 3600 * 1000
        })
        resJson.emit({res, data: {username, userid: _id}})
      } else {
        resJson.emit({res, error_code: 10003, hint_message: '密码不正确'})
      }
    } else {
      resJson.emit({res, error_code: 10004, hint_message: '暂无此用户'})
    }
  } catch (error) {
    console.log(error)
    resJson.emit({res, error_code: 20000})
  }
}

// 获取所有用户基本信息
const getUsersInfo = async (req, res) => {
  try {
    const data = await userDao.find({}, {
      password: 0,
    })
    resJson.emit({res, data})
  } catch (error) {
    console.log(error)
    resJson.emit({res, error_code: 20000})
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
  resJson.emit({res})
}

module.exports = {
  login,
  loginout,
  getUsersInfo
}