const IdentityDao = require('../dao/identity.dao.js');
const identityDao = new IdentityDao();
const BaseResJson = require('../util/baseResJson.js');
let resJson = new BaseResJson();

const create = async (req, res) => {
  try {
    const { name, status } = req.body
    if(!(name && (typeof status === 'boolean'))) resJson.emit({res, error_code: 10001})
    const data = await identityDao.create({
      name,
      status
    })
    if(data) {
      resJson.emit({res})
    } else {
      resJson.emit({res, error_code: 10002, hint_message: '保存失败'})
    }
  } catch (error) {
    console.log(error)
    resJson.emit({res, error_code: 20000})
  }
}

const find = async (req, res) => {
  try {
    const data = await identityDao.find({})
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

const findById = async (req, res) => {
  try {
    const { _id } = req.body
    if(!_id) resJson.emit({res, error_code: 10001})
    const data = await funcDao.findById(_id)
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

const update = async (req, res) => {
  try {
    const { id, name, status } = req.body
    if(!(id && (typeof status === 'boolean'))) resJson.emit({res, error_code: 10001})
    let project = {
      status
    }
    if(name) project.name = name

    const data = await identityDao.updateOne({
      id
    },{
      $set: project
    })
    
    if(data) {
      resJson.emit({res})
    } else {
      resJson.emit({res, error_code: 20000})
    }
  } catch (error) {
    console.log(error)
    resJson.emit({res, error_code: 20000})
  }
}

const remove = async (req, res) => {
  try {
    const { ids } = req.body
    console.log(ids instanceof Array)
    if(!Array.isArray(ids) || ids.length === 0) resJson.emit({res, error_code: 10001})
    const data = await identityDao.remove({
      id: {
        $in: ids
      }
    })
    if(data) {
      resJson.emit({res})
    } else {
      resJson.emit({res, error_code: 20000})
    }
  } catch (error) {
    console.log(error)
    resJson.emit({res, error_code: 20000})
  }
}

module.exports = {
  create,
  find,
  update,
  remove,
  findById
}