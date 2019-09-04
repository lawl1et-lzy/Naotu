const Mongoose = require('mongoose');
const Schema = Mongoose.Schema

const func = {
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
  value: {
    type: Number
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

let Func = new Schema(func, config)
Mongoose.model('func', Func)