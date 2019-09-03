const IdentityDao = require('../dao/identity.dao.js');
const BaseResJson = require('../util/baseResJson.js');
const BaseUtil = require('../util/base.js');

const identityDao = new IdentityDao();
let resJson = new BaseResJson();
const baseUitl = new BaseUtil();

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
      resJson.emit({res, error_code: 10002})
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
    const data = await identityDao.findById(_id)
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
    const { _id, name, status } = req.body
    if(!(_id && (typeof status === 'boolean'))) resJson.emit({res, error_code: 10001})
    let project = {
      status
    }
    if(name) project.name = name

    const data = await identityDao.findByIdAndUpdate(
      _id,
      {
        $set: project
      }
    )
    
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

const remove = async (req, res) => {
  try {
    const { _ids } = req.body
    console.log(_ids instanceof Array)
    if(!Array.isArray(_ids) || _ids.length === 0) resJson.emit({res, error_code: 10001})
    
    let newids = []
    for (let _id of _ids) {
      let formatId = await baseUitl.formatToObjectId(_id)
      newids.push(formatId)
    }
    const data = await identityDao.remove({
      _id: {
        $in: _ids
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