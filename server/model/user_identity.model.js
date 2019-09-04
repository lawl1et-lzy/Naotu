const Mongoose = require('mongoose');
const Schema = Mongoose.Schema

const user_identity = {
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    require: true
  },
  identity: {
    type: Schema.Types.ObjectId,
    ref: 'identity',
    require: true
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

let User_identity = new Schema(user_identity, config)
Mongoose.model('user_identity', User_identity)