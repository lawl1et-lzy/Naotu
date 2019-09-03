const BaseDao = require('./base.dao.js');
require('../model/identity_func.model.js');
const Mongoose = require('mongoose');
const identityFunc = Mongoose.model('identity_func');

class IdentityFuncDao extends BaseDao{
  constructor () {
    super(identityFunc)
  }
}

module.exports = IdentityFuncDao