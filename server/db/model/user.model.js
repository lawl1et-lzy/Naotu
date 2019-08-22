const Mongoose = require('mongoose');
const Schema = Mongoose.Schema

let user = {
  username: {
    type: String,
    trim: true
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
  status: {
    type: Number,
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'group'
  },
  catgory: [{
    type: Schema.Types.ObjectId,
    ref: 'catgory'
  }],
  naotus: {
    type: Schema.Types.ObjectId,
    ref: 'naotu'
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