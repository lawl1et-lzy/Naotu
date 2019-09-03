const Mongoose = require('mongoose');
const Schema = Mongoose.Schema

const user = {
  username: {
    type: String,
    trim: true,
    required:true
  },
  password: {
    type: String,
    trim: true
  },
  email: {
    type: String,
  },
  realname: {
    type: String,
  },
  sex: {
    type: Number,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
  },
  department: {
    type: String,
  },
  group: {
    type: String,
  },
  isDelete: {
    type: Boolean,
    default: false
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

let User = new Schema(user, config)
Mongoose.model('user', User)