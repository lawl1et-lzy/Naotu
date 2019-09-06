const express = require('express');
const router = express.Router();
const userIdentityControler = require('../controler/user_identity.controler.js');

router.post('/naotu/api/user_identity_create', userIdentityControler.create)

router.post('/naotu/api/user_identity_find', userIdentityControler.find)

router.post('/naotu/api/user_identity_findById', userIdentityControler.findById)

router.post('/naotu/api/user_identity_update', userIdentityControler.update)

router.post('/naotu/api/user_identity_remove', userIdentityControler.remove)

router.post('/naotu/api/user_identity_userConnectFunc', userIdentityControler.userConnectFunc)

module.exports = router