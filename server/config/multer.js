const multer = require('multer')
const storage = multer.diskStorage({
  destination (req, file, cb) {
    cb(null, './tmp/upload')
  },
  filename (req, file, cb) {
    let str = file.originalname.split('.')
    cb(null, Date.now() + '.' + str[1])
  }
})

const upload = multer({storage})

module.exports = upload