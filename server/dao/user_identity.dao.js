const BaseDao = require('./base.dao.js');
require('../model/user_identity.model.js');
const Mongoose = require('mongoose');
const userIdentity = Mongoose.model('user_identity');

class UserIdentityDao extends BaseDao{
  constructor () {
    super(userIdentity)
  }
}

module.exports = UserIdentityDao