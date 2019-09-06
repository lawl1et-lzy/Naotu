const express = require('express');
const router = express.Router();
const userControler = require('../controler/user.controler.js');

router.post('/naotu/api/login', userControler.login)

router.post('/naotu/api/loginout', userControler.loginout)

router.post('/naotu/api/get_users_info', userControler.getUsersInfo)

module.exports = router