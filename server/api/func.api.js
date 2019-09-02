const express = require('express');
const router = express.Router();
const funcControler = require('../controler/func.controler.js');

router.post('/api/naotu/func_create', funcControler.create)

router.post('/api/naotu/func_find', funcControler.find)

router.post('/api/naotu/func_update', funcControler.update)

router.post('/api/naotu/func_remove', funcControler.remove)

module.exports = router