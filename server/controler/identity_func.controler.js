const IdentityFunDao = require('../dao/identity_func.dao.js');
const IdentityDao = require('../dao/identity.dao.js');
const FuncDao = require('../dao/func.dao.js');
const BaseResJson = require('../util/baseResJson.js');
const BaseUtil = require('../util/base.js');

const identityFunDao = new IdentityFunDao();
const identityDao = new IdentityDao();
const funcDao = new FuncDao();
const baseUitl = new BaseUtil();
let resJson = new BaseResJson();


const create = async (req, res) => {
  try {
    const { identityid, funcsids, status } = req.body
    if(!(identityid && Array.isArray(funcsids) && (typeof status === 'boolean'))) resJson.emit({res, error_code: 10001})
    
    let newFuncsids = []
    let newIdentityid = await baseUitl.formatToObjectId(identityid)
    for (let _id of funcsids) {
      let formatId = await baseUitl.formatToObjectId(_id)
      newFuncsids.push(formatId)
    }

    const identity = await identityDao.findOne({ _id: newIdentityid })
    const funcs = await funcDao.find({ _id: {
      $in: newFuncsids
    } })
    if(!(identity && funcs)) {
      resJson.emit({res, error_code: 10001})
      return false
    }
    
    const data = await identityFunDao.create({
      identity,
      funcs,
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
    const data = await identityFunDao.findWithPopulate({populateOpts: [{path: 'identity'}, {path: 'funcs'}]})
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
    const data = await identityFunDao.findByIdWithPopulate({_id})
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
    const { _id, identityid, funcsids, status } = req.body
    if(!(_id && identityid && Array.isArray(funcsids) && (typeof status === 'boolean'))) resJson.emit({res, error_code: 10001})
    let newid = await baseUitl.formatToObjectId(_id)
    let newFuncsids = []
    let newIdentityid = await baseUitl.formatToObjectId(identityid)
    for (let _id of funcsids) {
      let formatId = await baseUitl.formatToObjectId(_id)
      newFuncsids.push(formatId)
    }
    const identity = await identityDao.findOne({ _id: newIdentityid })
    const funcs = await funcDao.find({ _id: {
      $in: newFuncsids
    } })
    if(!(identity && funcs)) {
      resJson.emit({res, error_code: 10001})
      return false
    }
    const data = await identityFunDao.findByIdAndUpdate(newid, {
      $set: {
        status,
        identity,
        funcs
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

const remove = async (req, res) => {
  try {
    const { _ids } = req.body
    if(!Array.isArray(_ids) || _ids.length === 0) resJson.emit({res, error_code: 10001})
    let newIds = []
    for (let _id of _ids) {
      let formatId = await baseUitl.formatToObjectId(_id)
      newIds.push(formatId)
    }
    const data = await identityFunDao.remove({
      _id: {
        $in: newIds
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