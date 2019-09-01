const BaseDao = require('./base.dao.js');
require('../model/file.model.js');
const Mongoose = require('mongoose');
const file = Mongoose.model('file');

class FileDao extends BaseDao{
  constructor () {
    super(file)
  }
  
}

module.exports = FileDao