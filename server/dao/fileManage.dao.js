const BaseDao = require('./base.dao.js');
require('../model/fileManage.model.js');
const Mongoose = require('mongoose');
const fileManage = Mongoose.model('fileManage');

class FileManageDao extends BaseDao{
  constructor () {
    super(fileManage)
  }
  
}

module.exports = FileManageDao