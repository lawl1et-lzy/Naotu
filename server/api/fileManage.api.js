const express = require('express');
const router = express.Router();
const fileManageControler = require('../controler/fileManage.controler.js');
const upload = require('../config/multer')

router.post('/api/naotu/uploadImgs', upload.array('upload_file', 5), fileManageControler.upload)

module.exports = router