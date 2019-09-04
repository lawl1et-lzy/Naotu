const FuncDao = require('../dao/func.dao.js');
const BaseResJson = require('../util/baseResJson.js');
const BaseUtil = require('../util/base.js');

let resJson = new BaseResJson();
const funcDao = new FuncDao();
const baseUitl = new BaseUtil();

const create = async (req, res) => {
  try {
    const { name, value, status } = req.body
    if(!(name && value && (typeof status === 'boolean'))) resJson.emit({res, error_code: 10001})
    const data = await funcDao.create({
      name,
      status,
      value: Number(value)
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
    const data = await funcDao.find({})
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
    const { _id, name, value, status } = req.body
    if(!(_id && value && (typeof status === 'boolean'))) resJson.emit({res, error_code: 10001})
    let project = {
      status
    }
    if(name) project.name = name
    if(value) project.value = Number(value)
    const data = await funcDao.findByIdAndUpdate(
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
    if(!Array.isArray(_ids) || _ids.length === 0) resJson.emit({res, error_code: 10001})
    
    let newids = []
    for (let _id of _ids) {
      let formatId = await baseUitl.formatToObjectId(_id)
      newids.push(formatId)
    }
    const data = await funcDao.remove({
      _id: {
        $in: _ids
      }
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

module.exports = {
  create,
  find,
  update,
  remove,
  findById
}