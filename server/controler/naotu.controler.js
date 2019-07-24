require('../db/model/naotu.model.js')
const Mongoose = require('mongoose');
const modelNaotu = Mongoose.model('naotu');
const base = require('../util/base.js');

const ROOT_GUID = 'lawliet111'

// 获取 root guid
let getRootGuid = async (req, res, next) => {
  try {
    let data = await modelNaotu.findOne({ fileGuid: ROOT_GUID })
    if(!data) {
      let rp = {
        parentGuid: '0',
        fileGuid: ROOT_GUID,
        fileName: 'root',
        fileType: 'directory',
        extName: ''
      }
      let naotu = new modelNaotu(rp)
      data = await naotu.save(rp)
    }
    responseJson({res, data})
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
  }
}

// 添加文件
let addFile = async (req, res, next) => {
  try {
    let { parentGuid } = req.body
    let rp = {}
    rp.parentGuid = parentGuid // 父级ID
    rp.fileGuid = base.generateVVID().split('-').join('') // 生成文件ID
    let naotu = new modelNaotu(rp)
    let data = await naotu.save()
    responseJson({res, data})
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
  }
}

// 添加文件夹
let addDirectory = async (req, res, next) => {
  try {
    let { parentGuid, fileName = '新建文件夹', fileType = 'directory', extName = '' } = req.body
    let rp = {
      parentGuid,
      fileGuid: base.generateVVID().split('-').join(''), // 生成文件ID
      fileName,
      fileType,
      extName
    }

    let naotu = new modelNaotu(rp)
    await naotu.save()
    responseJson({res})
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
  }
}

// 重命名
let reName = async (req, res, next) => {
  let { fileGuid, fileName } = req.body
  if(!(fileGuid && fileName)) responseJson({res, error_code: 10001})
  try {
    await modelNaotu.update({ fileGuid }, { fileName })
    responseJson({res})
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
  }
}

// 更新单个字段
let update = async (req, res, next) => {
  try {
    let rp = req.body
    if(!(base.isObject(rp) && Object.keys(rp).length > 0)) responseJson({res, error_code: 10001})
    let fileGuid = rp.fileGuid
    let modifyDoc = {...rp}
    delete modifyDoc.fileGuid
    await modelNaotu.update({ fileGuid }, modifyDoc)
    responseJson({res})
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
  }
}

// 批量丢入回收站
let rm = async (req, res, next) => {
  try {
    let { fileGuidArr } = req.body
    if(!(Array.isArray(fileGuidArr) && fileGuidArr.length > 0)) responseJson({res, error_code: 10001})
    let _fileGuidArr = formatFileGuid(fileGuidArr)
    let _resp = await findRelatedFiles(_fileGuidArr)
    if(_resp.length > 0) {
      let resp = selectFileGuids(_resp)
      await modelNaotu.updateMany({fileGuid: { $in: resp }}, { isDelete: true }, {multi: true})
      responseJson({res})
    }
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
  }
}

// 查询文件
let queryFile = async(req, res ,next) => {
  try {
    let { fileGuid } = req.body;
    if(!fileGuid) responseJson({res, error_code: 10001})
    let rp = {
      fileGuid
    }
    let data = await modelNaotu.find(rp)
    responseJson({res, data})
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
  }
}

// 查询文件夹
let queryDirectoty = async(req, res ,next) => {
  try {
    let { parentGuid } = req.body
    if(!parentGuid) responseJson({res, error_code: 10001})
    let rp = {
      parentGuid,
      isDelete: {
        $eq: false
      }
    }
    let data = await modelNaotu.find(rp)
    responseJson({res, data})
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
  }
  
}

// 回收站数据列表
let queryDirectotyForTrash = async(req, res ,next) => {
  try {
    let rp = {
      isDelete: {
        $eq: true
      }
    }
    let data = []
    let resp = await modelNaotu.find(rp)
    if(resp.length > 0) data = await filterForTrash(resp)
    responseJson({res, data})
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
  }
}

// 批量还原
let revertFiles = async (req, res, next) => {
  try {
    let { fileGuidArr } = req.body
    if(!(Array.isArray(fileGuidArr) && fileGuidArr.length > 0)) responseJson({res, error_code: 10001})
    let _fileGuidArr = formatFileGuid(fileGuidArr)
    let _resp = await findRelatedFiles(_fileGuidArr)
    if(_resp.length > 0) {
      let resp = selectFileGuids(_resp)
      await modelNaotu.updateMany({fileGuid: { $in: resp }}, { isDelete: false }, {multi: true})
    }
    responseJson({res})
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
  }
}

// 批量永久删除
let deleteFiles = async (req, res, next) => {
  try {
    let { fileGuidArr } = req.body
    if(!(Array.isArray(fileGuidArr) && fileGuidArr.length > 0)) responseJson({res, error_code: 10001})
    let _fileGuidArr = formatFileGuid(fileGuidArr)
    let _resp = await findRelatedFiles(_fileGuidArr)
    if(_resp.length > 0) {
      let resp = selectFileGuids(_resp)
      await modelNaotu.remove({fileGuid: { $in: resp }})
    }
    responseJson({res})
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
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
    responseJson({res, error_code: 20000})
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

/**
 * @param {*} res 
 * @param {*} error_code 
 * @param {*} error_message 
 * @param {*} hint_message 
 * @param {*} data 
 */
let responseJson = ({res, error_code = 0, error_message = '', hint_message, data}) => {
  switch(error_code){
    case 0:
      hint_message = ''
      break;
    case 10001:
      hint_message = '参数错误'
      break;
    case 20000:
      hint_message = '系统错误'
      break;
  }

  let resp = {
    response: {
      error_code,
      error_message,
      hint_message,
    }
  } 
  if(data) resp.data = data

  res.json(resp)
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