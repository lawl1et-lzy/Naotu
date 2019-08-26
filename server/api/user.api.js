const express = require('express');
const router = express.Router();
const userControler = require('../controler/user.controler.js');

// login
router.post('/api/naotu/login', userControler.login)

// loginout
router.post('/api/naotu/loginout', userControler.loginout)

module.exports = router