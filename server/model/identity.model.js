const Mongoose = require('mongoose');
const Schema = Mongoose.Schema

const identity = {
  name: {
    type: String,
    trim: true,
    required:true
  },
  status: {
    type: Boolean,
    required:true,
    default: true
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

let Identity = new Schema(identity, config)
Mongoose.model('identity', Identity)