require('../db/model/naotu.model.js')
const Mongoose = require('mongoose');
const modelNaotu = Mongoose.model('naotu');
const base = require('../util/base.js');

const ROOT_GUID = 'lawliet111'

// 获取 root guid
let getRootGuid = async (req, res, next) => {
  let data = {}
  let file = await modelNaotu.findOne({ fileGuid: ROOT_GUID })
  if(file) {
    data.fileGuid = file.fileGuid
  } else {
    let rp = {
      parentGuid: '0',
      fileGuid: ROOT_GUID,
      fileName: 'root',
      fileType: 'directory',
      extName: ''
    }
    let naotu = new modelNaotu(rp)
    await naotu.save(rp)
      .then(doc => {
        data = doc
      })
      .catch(err => {
        res.json({
          response: {
            error_code: 10001,
            error_message: '',
            hint_message: err,
          },
          data
        })
      }) 
  }
  res.json({
    response: {
      error_code: 0,
      error_message: '',
      hint_message: '',
    },
    data
  })
}

// 添加文件
let addFile = async (req, res, next) => {
  let { parentGuid } = req.body
  let rp = {}

  rp.parentGuid = parentGuid // 父级ID
  rp.fileGuid = base.generateVVID().split('-').join('') // 生成文件ID

  let naotu = new modelNaotu(rp)
  naotu.save()
    .then(data => {
        res.json({
          response: {
            error_code: 0,
            error_message: '',
            hint_message: '',
          },
          data
        })
    })
    .catch(err => {
      res.json({
        response: {
          error_code: 10001,
          error_message: err,
          hint_message: '新增失败',
        }
      })
    })
}

// 添加文件夹
let addDirectory = async (req, res, next) => {
  let { parentGuid, fileName = '新建文件夹', fileType = 'directory', extName = '' } = req.body
  let rp = {
    parentGuid,
    fileGuid: base.generateVVID().split('-').join(''), // 生成文件ID
    fileName,
    fileType,
    extName
  }

  let naotu = new modelNaotu(rp)
  naotu.save()
    .then(data => {
        res.json({
          response: {
            error_code: 0,
            error_message: '',
            hint_message: '',
          },
          data
        })
    })
    .catch(err => {
      res.json({
        response: {
          error_code: 10001,
          error_message: err,
          hint_message: '新增失败',
        }
      })
    })
}

// 重命名
let reName = async (req, res, next) => {
  let { fileGuid, newName } = req.body
  let file = await modelNaotu.findOne({ fileGuid })
  if(file) {
    file.fileName = newName
    file.save()
      .then(doc => {
        res.json({
          response: {
            error_code: 0,
            error_message: '',
            hint_message: 'success',
          }
        })
      })
      .catch(err => {
        res.json({
          response: {
            error_code: 10001,
            error_message: '',
            hint_message: err,
          }
        })
      })
  }
}

// 更新
let update = async (req, res, next) => {
  let { fileGuid, content } = req.body
  let file = await modelNaotu.findOne({fileGuid})
  if(file) {
    file.content = content
    file.save()
      .then(doc => {
        res.json({
          response: {
            error_code: 0,
            error_message: '',
            hint_message: '添加成功',
          }
        })
      })
      .catch(err => {
        res.json({
          response: {
            error_code: 10001,
            error_message: '',
            hint_message: err,
          }
        })
      })
  } else {
    add(req, res, next)
  }
}

/**
 * 批量删除 文件 或者 文件夹
 * 1. 文件
 *  1.1 直接删除
 * 
 * 2. 文件夹
 *  2.1 删除当前文件夹
 *  2.2 删除所有 以该文件夹 fileGuid 为 parentGuid 的 files
 */
let del = async (req, res, next) => {
  let { fileGuidArr } = req.body
  if(Array.isArray(fileGuidArr) && fileGuidArr.length > 0) {
    fileGuidArr.forEach(async fileGuid => {
      let rp = {}
      let file = await modelNaotu.findOne({ fileGuid })
      if(file) {
        rp.fileGuid = fileGuid
        // 判断是否是文件夹类型
        if(file.fileType === 'directory'){
          rp.parentGuid = rp.fileGuid
        }
        modelNaotu.deleteMany(rp)
          .then(doc => {
            res.json({
              response: {
                error_code: 0,
                error_message: '',
                hint_message: '删除成功',
              }
            })
          })
          .catch(err => {
            res.json({
              response: {
                error_code: 10001,
                error_message: '',
                hint_message: err,
              }
            })
          })
      } else {
        res.json({
          response: {
            error_code: 200,
            error_message: '',
            hint_message: '暂无此文件夹',
          }
        })
      }
    })
  } else {
    res.json({
      response: {
        error_code: 10001,
        error_message: '',
        hint_message: '参数有误',
      }
    })
  }
}

// queryFile
let queryFile = async(req, res ,next) => {
  let { fileGuid } = req.body
  let rp = {
    fileGuid
  }
  modelNaotu.find(rp)
    .then(data => {
      res.json({
        response: {
          error_code: 0,
          error_message: '',
          hint_message: '',
        },
        data
      })
    })
    .catch(err => {
      res.json({
        response: {
          error_code: 10001,
          error_message: '',
          hint_message: err,
        }
      })
    })
}

// queryDirectoty
let queryDirectoty = async(req, res ,next) => {
  let { parentGuid } = req.body
  let rp = {
    parentGuid
  }
  modelNaotu.find(rp)
    .then(data => {
      res.json({
        response: {
          error_code: 0,
          error_message: '',
          hint_message: '',
        },
        data
      })
    })
    .catch(err => {
      res.json({
        response: {
          error_code: 10001,
          error_message: '',
          hint_message: err,
        }
      })
    })
}

module.exports = {
  getRootGuid,
  addFile,
  reName,
  addDirectory,
  update,
  del,
  queryFile,
  queryDirectoty
}