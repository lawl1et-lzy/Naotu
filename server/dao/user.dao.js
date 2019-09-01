const BaseDao = require('./base.dao.js');
require('../model/user.model.js');
const Mongoose = require('mongoose');
const user = Mongoose.model('user');

class UserDao extends BaseDao {
  constructor () {
    super(user)
  }
}

module.exports = UserDao