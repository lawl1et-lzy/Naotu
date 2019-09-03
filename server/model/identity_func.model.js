const Mongoose = require('mongoose');
const Schema = Mongoose.Schema

const identity_func = {
  identity: {
    type: Schema.Types.ObjectId,
    ref: 'identity',
    require: true
  },
  funcs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'func',
      require: true
    }
  ],
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

let Identity_func = new Schema(identity_func, config)
Mongoose.model('identity_func', Identity_func)