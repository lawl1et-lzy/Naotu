const express = require('express');
const router = express.Router();
const fileManageControler = require('../controler/fileManage.controler.js');
const upload = require('../config/multer')

router.post('/naotu/api/uploadImgs', upload.array('files', 5), fileManageControler.upload)

module.exports = router