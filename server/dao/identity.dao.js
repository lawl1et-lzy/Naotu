const BaseDao = require('./base.dao.js');
require('../model/identity.model.js');
const Mongoose = require('mongoose');
const identity = Mongoose.model('identity');

class IdentityDao extends BaseDao{
  constructor () {
    super(identity)
  }
  
}

module.exports = IdentityDao