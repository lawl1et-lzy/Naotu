const FileManageDao = require('../dao/fileManage.dao.js');
const BaseResJson = require('../util/baseResJson.js');
const BaseUtil = require('../util/base.js');

let resJson = new BaseResJson();
const fileManageDao = new FileManageDao();
const baseUitl = new BaseUtil();
const dir = '/upload'
const upload = async (req, res) => {
  try {
    const imgFiles = req.files
    const { userid } = JSON.parse(req.cookies.user)

    let docs = []
    for (let img of imgFiles) {
      let doc = {
        userid
      }
      const path = `${dir}/${img.filename}`
      doc.name = img.filename
      doc.path = path
      docs.push(doc)
    }

    const data = await fileManageDao.insertMany(docs)
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


module.exports = {
  upload
}