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

// 更新单个字段
let update = async (req, res, next) => {
  let rp = req.body
  if(!(base.isObject(rp) && Object.keys(rp).length > 0)){
    res.json({
      response: {
        error_code: 10003,
        error_message: '',
        hint_message: '传入参数有误',
      }
    })
    return false
  }
  let file = await modelNaotu.findOne({fileGuid: rp.fileGuid})
  if(file) {
    Object.assign(file, rp)
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
    res.json({
      response: {
        error_code: 10002,
        error_message: '',
        hint_message: '暂无此数据',
      }
    })
  }
}

// 批量丢入回收站
let rm = async (req, res, next) => {
  try {
    let { fileGuidArr } = req.body
    if(Array.isArray(fileGuidArr) && fileGuidArr.length > 0) {
      let _fileGuidArr = formatFileGuid(fileGuidArr)
      let _resp = await findRelatedFiles(_fileGuidArr)
      if(_resp.length > 0) {
        let resp = selectFileGuids(_resp)
        let updateResp = await modelNaotu.updateMany({fileGuid: { $in: resp }}, { isDelete: true }, {multi: true})
        if(updateResp) {
          res.json({
            response: {
              error_code: 0,
              error_message: '',
              hint_message: '删除成功',
            }
          })
        }
      }
      res.json({
        response: {
          error_code: 10001,
          error_message: '',
          hint_message: '系统错误',
        }
      })
    } else {
      res.json({
        response: {
          error_code: 10002,
          error_message: '',
          hint_message: '参数有误',
        }
      })
    }
  } catch (error) {
    console.log(error)
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
    parentGuid,
    isDelete: {
      $eq: false
    }
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

// queryDirectotyForTrash
let queryDirectotyForTrash = async(req, res ,next) => {
  // let { parentGuid } = req.body
  let rp = {
    // parentGuid,
    isDelete: {
      $eq: true
    }
  }
  let resp = await modelNaotu.find(rp)
  if(resp.length > 0) {
    let data = await filterForTrash(resp) 
    res.json({
      response: {
        error_code: 0,
        error_message: '',
        hint_message: 'success',
      },
      data
    })
  } else {
    res.json({
      response: {
        error_code: 0,
        error_message: '',
        hint_message: 'success',
      },
      data: []
    })
  }
}

// 批量还原
let revertFiles = async (req, res, next) => {
  try {
    let { fileGuidArr } = req.body
    if(Array.isArray(fileGuidArr) && fileGuidArr.length > 0) {
      let _fileGuidArr = formatFileGuid(fileGuidArr)
      let _resp = await findRelatedFiles(_fileGuidArr)
      if(_resp.length > 0) {
        let resp = selectFileGuids(_resp)
        let updateResp = await modelNaotu.updateMany({fileGuid: { $in: resp }}, { isDelete: false }, {multi: true})
        if(updateResp) {
          res.json({
            response: {
              error_code: 0,
              error_message: '',
              hint_message: '还原成功',
            }
          })
        }
      }
      res.json({
        response: {
          error_code: 10001,
          error_message: '',
          hint_message: '系统错误',
        }
      })
    } else {
      res.json({
        response: {
          error_code: 10002,
          error_message: '',
          hint_message: '参数有误',
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

// 批量永久删除
let deleteFiles = async (req, res, next) => {
  try {
    let { fileGuidArr } = req.body
    if(Array.isArray(fileGuidArr) && fileGuidArr.length > 0) {
      let _fileGuidArr = formatFileGuid(fileGuidArr)
      let _resp = await findRelatedFiles(_fileGuidArr)
      if(_resp.length > 0) {
        let resp = selectFileGuids(_resp)
        let updateResp = await modelNaotu.remove({fileGuid: { $in: resp }})
        if(updateResp) {
          res.json({
            response: {
              error_code: 0,
              error_message: '',
              hint_message: '删除成功',
            }
          })
        }
      }
      res.json({
        response: {
          error_code: 10001,
          error_message: '',
          hint_message: '系统错误',
        }
      })
    } else {
      res.json({
        response: {
          error_code: 10002,
          error_message: '',
          hint_message: '参数有误',
        }
      })
    }
  } catch (error) {
    console.log(error)
  }
}

/**
 * 格式化fileGuidArr
 * @param {*} fileGuidArr
 */
let formatFileGuid = (fileGuidArr) => {
  let newArr = []
  if(Array.isArray(fileGuidArr) && fileGuidArr.length > 0) {
    fileGuidArr.forEach(item => {
      newArr.push({fileGuid: item})
    })
  }
  return newArr
}

/**
 * @description 格式化出所有的 fileGuid 数组
 * @param {*} files 
 * @returns {Array}
 */
let selectFileGuids = (files) => {
  let arr = []
  if(Array.isArray(files) && files.length > 0) {
    files.forEach(item => {
      arr.push(item.fileGuid)
    })
  }
  return arr
}

/**
 * @description 递归遍历出所有满足条件的数据
 * @param {Array} fileGuidArr 
 */
let findRelatedFiles = async (fileGuidArr) => {
  try {
    let relatedFiles = []
    let fn = async (fileGuidArr) => {
      for(let i = 0; i < fileGuidArr.length; i++) {
        let { fileGuid } = fileGuidArr[i]
        // 查找当前 fileGuid 的数据
        let file = await modelNaotu.findOne({fileGuid})
        // 查找子目录数据
        let subFile = await modelNaotu.find({parentGuid: file.fileGuid})
        relatedFiles.push(file)
        if(subFile.length > 0) {
          await fn(subFile)
        }
      }
    }
    await fn(fileGuidArr)
    return relatedFiles
  } catch (error) {
    console.log(error)
  }
}

/**
 * @param {*} files 
 */
let filterForTrash = async (files) => {
  let output = []
  for(let i = 0; i < files.length; i++) {
    let pData = await modelNaotu.findOne({fileGuid: files[i].parentGuid})
    if(!pData.isDelete) {
      output.push(files[i])
    }
  }
  return output
}

module.exports = {
  getRootGuid,
  addFile,
  reName,
  addDirectory,
  update,
  queryFile,
  queryDirectoty,
  queryDirectotyForTrash,
  rm,
  revertFiles,
  deleteFiles
}