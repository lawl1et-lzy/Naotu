const UserIdentityDao = require('../dao/user_identity.dao.js');
const IdentityDao = require('../dao/identity.dao.js');
const UserDao = require('../dao/user.dao.js');
const BaseResJson = require('../util/baseResJson.js');
const BaseUtil = require('../util/base.js');

const userIdentityDao = new UserIdentityDao();
const identityDao = new IdentityDao();
const userDao = new UserDao();
const baseUitl = new BaseUtil();
let resJson = new BaseResJson();


const create = async (req, res) => {
  try {
    const { identityid, userid, status } = req.body
    if(!(identityid && userid && (typeof status === 'boolean'))) resJson.emit({res, error_code: 10001})
    
    const identity = await identityDao.findById(identityid)
    const user = await userDao.findById(userid)

    if(!(identity && user)) {
      resJson.emit({res, error_code: 10001})
      return false
    }
    
    const data = await userIdentityDao.create({
      identity,
      user,
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
    const data = await userIdentityDao.findWithPopulate({populateOpts: [{path: 'identity'}, {path: 'user'}]})
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
    const data = await userIdentityDao.findByIdWithPopulate({_id})
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
    const { _id, identityid, userid, status } = req.body
    if(!(_id && identityid && userid && (typeof status === 'boolean'))) resJson.emit({res, error_code: 10001})
    
    let newid = await baseUitl.formatToObjectId(_id)
    let newUserid = await baseUitl.formatToObjectId(userid)
    let newIdentityid = await baseUitl.formatToObjectId(identityid)

    const identity = await identityDao.findById(newIdentityid)
    const user = await userDao.findById(newUserid)

    if(!(identity && user)) {
      resJson.emit({res, error_code: 10001})
      return false
    }
    const data = await userIdentityDao.findByIdAndUpdate(newid, {
      $set: {
        status,
        identity,
        user
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
    const data = await userIdentityDao.remove({
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