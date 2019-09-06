const Mongoose = require('mongoose');
const Schema = Mongoose.Schema

const fileManage = {
  // 用户ID
  userid: {
    type: String,
    required:true
  },
  name: {
    type: String,
  },
  path: {
    type: String,
    trim: true,
    required:true
  },
  deleteTime: {
    type: Date,
  }
}

let config = {
  versionKey: false,
  timestamps: { 
    // 创建时间
    createdAt: 'createTime',
    // 最后一次更新时间
    updatedAt: 'updateTime' 
  }
}

let FileManage = new Schema(fileManage, config)
Mongoose.model('fileManage', FileManage)