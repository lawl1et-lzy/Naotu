const FuncDao = require('../dao/func.dao.js');
const funcDao = new FuncDao();

const create = async (req, res) => {
  try {
    const { name, status } = req.body
    if(!(name && (typeof status === 'boolean'))) responseJson({res, error_code: 10001})
    const data = await funcDao.create({
      name,
      status
    })
    if(data) {
      responseJson({res})
    } else {
      responseJson({res, error_code: 10002, hint_message: '保存失败'})
    }
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
  }
}

const find = async (req, res) => {
  try {
    const { id } = req.body
    const query = id ? { id } : {}
    const data = await funcDao.find(query, {
      _id: 0
    })
    if(data) {
      responseJson({res, data})
    } else {
      responseJson({res, error_code: 2000})
    }
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
  }
}

const update = async (req, res) => {
  try {
    const { id, name, status } = req.body
    if(!(id && (typeof status === 'boolean'))) responseJson({res, error_code: 10001})
    let project = {
      status
    }
    if(name) project.name = name

    const data = await funcDao.updateOne({
      id
    },{
      $set: project
    })
    
    if(data) {
      responseJson({res})
    } else {
      responseJson({res, error_code: 2000})
    }
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
  }
}

const remove = async (req, res) => {
  try {
    const { ids } = req.body
    console.log(ids instanceof Array)
    if(!Array.isArray(ids) || ids.length === 0) responseJson({res, error_code: 10001})
    const data = await funcDao.remove({
      id: {
        $in: ids
      }
    })
    if(data) {
      responseJson({res})
    } else {
      responseJson({res, error_code: 2000})
    }
  } catch (error) {
    console.log(error)
    responseJson({res, error_code: 2000})
  }
}

/**
 * @param {*} res 
 * @param {*} error_code 
 * @param {*} error_message 
 * @param {*} hint_message 
 * @param {*} data 
 */
const responseJson = ({res, error_code = 0, error_message = '', hint_message, data}) => {
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
  create,
  find,
  update,
  remove
}