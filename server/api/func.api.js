const express = require('express');
const router = express.Router();
const funcControler = require('../controler/func.controler.js');

router.post('/naotu/api/func_create', funcControler.create)

router.post('/naotu/api/func_find', funcControler.find)

router.post('/naotu/api/func_findById', funcControler.findById)

router.post('/naotu/api/func_update', funcControler.update)

router.post('/naotu/api/func_remove', funcControler.remove)

module.exports = router