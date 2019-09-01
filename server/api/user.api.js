const express = require('express');
const router = express.Router();
const userControler = require('../controler/user.controler.js');

router.post('/api/naotu/login', userControler.login)

router.post('/api/naotu/loginout', userControler.loginout)

router.post('/api/naotu/userinfo', userControler.userinfo)

module.exports = router