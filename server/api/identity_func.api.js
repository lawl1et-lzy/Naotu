const express = require('express');
const router = express.Router();
const identityFuncControler = require('../controler/identity_func.controler.js');

router.post('/naotu/api/identity_func_create', identityFuncControler.create)

router.post('/naotu/api/identity_func_find', identityFuncControler.find)

router.post('/naotu/api/identity_func_findById', identityFuncControler.findById)

router.post('/naotu/api/identity_func_update', identityFuncControler.update)

router.post('/naotu/api/identity_func_remove', identityFuncControler.remove)

module.exports = router