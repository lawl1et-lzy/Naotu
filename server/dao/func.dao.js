const BaseDao = require('./base.dao.js');
require('../model/func.model.js');
const Mongoose = require('mongoose');
const func = Mongoose.model('func');

class FuncDao extends BaseDao{
  constructor () {
    super(func)
  }
  
}

module.exports = FuncDao