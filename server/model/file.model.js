const Mongoose = require('mongoose')
const Schema = Mongoose.Schema

const file = {
  // 用户ID
  userid: {
    type: String,
    required:true
  },
  // 父级文件夹ID
  parentid: {
    type: Schema.Types.ObjectId,
    required:true
  },
  // 文件名
  fileName: {
    type: String,
    default: '新建脑图'
  },
  /**
   * 文件类型
   * enum {
   *  directory = 1
   *  file = 2
   *  root = 3
   * }
   */
  fileType: {
    type: String,
    default: 'file',
    required:true
  }, 
  // 是否删除
  isDelete: {
    type: Boolean,
    default: false
  },
  // 文件大小
  fileSize: Number,
  // 扩展名
  extName: {
    type: String,
    default: '.km'
  },
  // 脑图JSON数据
  content: String,
  // 删除时间
  deleteTime: {
    type: Date,
  },
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

let File = new Schema(file, config)
Mongoose.model('file', File)