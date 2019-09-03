const FileDao = require('../dao/file.dao.js');
const BaseUtil = require('../util/base.js');
const BaseResJson = require('../util/baseResJson.js');
const mongoose =require('mongoose')

let baseUtil = new BaseUtil();
let resJson = new BaseResJson();
const fileDao = new FileDao();


// 获取 root guid
const getRootId = async (req, res, next) => {
  try {
    let data = await fileDao.findOne({ fileType: 'root' })
    if(!data) {
      const rp = {
        parentid: mongoose.Types.ObjectId(),
        fileName: '',
        fileType: 'root',
        extName: '',
        userid: 'qingqingrootid'
      }
      data = await fileDao.create(rp)
    }
    resJson.emit({res, data})
  } catch (error) {
    console.log(error)
    resJson.emit({res, error_code: 20000})
  }
}

// 添加文件
const addFile = async (req, res, next) => {
  try {
    const { userid } = JSON.parse(req.cookies.user)
    const { parentid } = req.body
    if(!parentid) resJson.emit({res, error_code: 10001})
    const data = await fileDao.create({
      parentid,
      userid
    })
    if(data) {
      resJson.emit({res, data})
    } else {
      resJson.emit({res, error_code: 10002})
    }
  } catch (error) {
    console.log(error)
    resJson.emit({res, error_code: 20000})
  }
}

// 添加文件夹
const addDirectory = async (req, res, next) => {
  try {
    const { userid } = JSON.parse(req.cookies.user)
    let { parentid, fileName = '新建文件夹' } = req.body
    let rp = {
      parentid,
      userid,
      fileName,
      fileType: 'directory',
      extName: ''
    }
    const data = await fileDao.create(rp)
    if(data) {
      resJson.emit({res})
    } else {
      resJson.emit({res, error_code: 10002})
    }
  } catch (error) {
    console.log(error)
    resJson.emit({res, error_code: 20000})
  }
}

// 重命名
const reName = async (req, res, next) => {
  try {
    const { _id, fileName } = req.body
    if(!(_id && fileName)) resJson.emit({res, error_code: 10001})
    const data = await fileDao.findByIdAndUpdate(_id, { fileName })
    if(data) {
      resJson.emit({res})
    } else {
      resJson.emit({res, error_code: 10002})
    }
  } catch (error) {
    console.log(error)
    resJson.emit({res, error_code: 20000})
  }
}

// 更新单个字段
const update = async (req, res, next) => {
  try {
    const rp = req.body
    if(!(baseUtil.isObject(rp) && Object.keys(rp).length > 0)) resJson.emit({res, error_code: 10001})
    const { _id } = rp
    const modifyDoc = {...rp}
    const data = await fileDao.findByIdAndUpdate(_id, modifyDoc)
    if(data) {
      resJson.emit({res})
    } else {
      resJson.emit({res, error_code: 10002})
    }
  } catch (error) {
    console.log(error)
    resJson.emit({res, error_code: 20000})
  }
}

// 批量丢入回收站
const rm = async (req, res, next) => {
  try {
    const { _ids } = req.body
    if(!(Array.isArray(_ids) && _ids.length > 0)) resJson.emit({res, error_code: 10001})
    const _fids = await findChildrenIds(_ids)

    if(Array.isArray(_fids) && _fids.length > 0) {
      // 更新数据
      const data = await fileDao.updateMany(
        {
          _id: {
            $in: _fids
          }
        },
        {
          $set: {
            isDelete: true
          }
        }
      )
      if(data) {
        resJson.emit({res})
      } else {
        resJson.emit({res, error_code: 10002})
      }
    } else {
      resJson.emit({res, error_code: 20000})
    }
  } catch (error) {
    console.log(error)
    resJson.emit({res, error_code: 20000})
  }
}

// 查询文件
const queryFile = async(req, res, next) => {
  try {
    const { _id } = req.body;
    if(!_id) resJson.emit({res, error_code: 10001})
    const data = await fileDao.findById(_id)
    if(data) {
      resJson.emit({res, data})
    } else {
      resJson.emit({res, error_code: 20000})
    }
  } catch (error) {
    console.log(error)
    resJson.emit({res, error_code: 20000})
  }
}

// 查询文件夹
const queryDirectory = async(req, res, next) => {
  try {
    let { parentid } = req.body
    if(!parentid) resJson.emit({res, error_code: 10001})
    const rp = {
      parentid,
      isDelete: {
        $eq: false
      }
    }
    const data = await fileDao.find(rp)
    if(data) {
      resJson.emit({res, data})
    } else {
      resJson.emit({res, error_code: 20000})
    }
  } catch (error) {
    console.log(error)
    resJson.emit({res, error_code: 20000})
  }
  
}

// 本人回收站数据列表
const querySelfDirectotyForTrash = async (req, res ,next) => {
  try {
    const { userid } = JSON.parse(req.cookies.user)
    let data = []
    
    // 查询一级父节点数据
    const files = await fileDao.aggregate([
      { 
        $graphLookup: { 
          from: "files", 
          startWith: "$parentid", 
          connectFromField: "parentid", 
          connectToField: "_id", 
          as: "parentFiles",
          maxDepth: 0
        } 
      },
      {
        $match: {
          isDelete: true,
          userid
        }
      }
    ])

    // 直接父节点数据的isDelete值为false，则push
    if(Array.isArray(files) && files.length > 0) {
      for(let file of files) {
        const PFiles = file.parentFiles
        if(PFiles.length > 0 && !PFiles[0].isDelete) {
          let _file = {...file}
          delete _file.parentFiles
          data.push(_file)
        }
      }
    }

    resJson.emit({res, data})
  } catch (error) {
    console.log(error)
    resJson.emit({res, error_code: 20000})
  }
}

// 批量还原
const revertFiles = async (req, res, next) => {
  try {
    const { _ids } = req.body
    if(!(Array.isArray(_ids) && _ids.length > 0)) resJson.emit({res, error_code: 10001})
    const _fids = await findChildrenIds(_ids)
    
    if(Array.isArray(_fids) && _fids.length > 0) {
      // 更新数据
      const data = await fileDao.updateMany(
        {
          _id: {
            $in: _fids
          }
        },
        {
          $set: {
            isDelete: false
          }
        }
      )
      if(data) {
        resJson.emit({res})
      } else {
        resJson.emit({res, error_code: 20000})
      }
    } else {
      resJson.emit({res, error_code: 20000})
    }
  } catch (error) {
    console.log(error)
    resJson.emit({res, error_code: 20000})
  }
}

// 批量永久删除
const deleteFiles = async (req, res, next) => {
  try {
    const { _ids } = req.body
    if(!(Array.isArray(_ids) && _ids.length > 0)) resJson.emit({res, error_code: 10001})
    const _fids = await findChildrenIds(_ids)
    
    if(Array.isArray(_fids) && _ids.length > 0) {
      // 更新数据
      const data = await fileDao.remove(
        {
          _id: {
            $in: _fids
          }
        }
      )
      if(data) {
        resJson.emit({res})
      } else {
        resJson.emit({res, error_code: 20000})
      }
    } else {
      resJson.emit({res, error_code: 20000})
    }
  } catch (error) {
    console.log(error)
    resJson.emit({res, error_code: 20000})
  }
}

// 查询所有的子节点（包含自身）的id集合
const findChildrenIds = async (_ids) => {
  if(!Array.isArray(_ids) || _ids.length === 0) return false
  let outids = []; // 返回值
  let newids = []; // 格式化 成 ObjectId
  for (let _id of _ids) {
    let formatId = await baseUtil.formatToObjectId(_id)
    newids.push(formatId)
  }
  // 查询所有的(包含自身)的子节点数据
  const files = await fileDao.aggregate([
    { 
      $graphLookup: { 
        from: "files", 
        startWith: "$_id", 
        connectFromField: "_id", 
        connectToField: "parentid", 
        as: "subFiles",
      } 
    },
    {
      $match: {
        _id: {
          $in: newids
        }
      }
    }
  ])

  if(Array.isArray(files) && files.length > 0) {
    // 遍历出所有的id
    for(let file of files) {
      outids.push(file._id)
      if(file.subFiles.length > 0) {
        for(let subfile of file.subFiles) {
          outids.push(subfile._id)
        }
      }
    }
  }
  return outids
}

module.exports = {
  getRootId,
  addFile,
  reName,
  addDirectory,
  update,
  queryFile,
  queryDirectory,
  querySelfDirectotyForTrash,
  rm,
  revertFiles,
  deleteFiles
}