const BaseDao = require('./base.dao.js');
require('../model/user_identity.model.js');
require('../model/identity_func.model.js');
const Mongoose = require('mongoose');
const userIdentity = Mongoose.model('user_identity');

class UserIdentityDao extends BaseDao{
  constructor () {
    super(userIdentity)
  }
  // 获取关联表 user 对应 功能数据
  async getUserFuncsInfo(userid) {
    try {
      const doc = await userIdentity.aggregate([
        {
          $lookup:
            {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "userInfo"
            }
        },
        {
          $lookup:
            {
              from: "identity_funcs",
              localField: "identity",
              foreignField: "identity",
              as: "identityFuncInfo"
            }
        },
        {
          $match: {
            user: userid
          }
        },
        {
          $project: {
            "userInfo.username": 1,
            "userInfo.realname": 1,
            "userInfo.email": 1,
            "userInfo.sex": 1,
            "userInfo.mobile": 1,
            "userInfo.address": 1,
            "userInfo.department": 1,
            "identityFuncInfo._id": 1,
            "identityFuncInfo.funcs": 1,
          }
        }
      ])
      return doc[0]

    } catch (error) {
      console.log('getUserFuncsInfo', error)
    }
  }
}

module.exports = UserIdentityDao