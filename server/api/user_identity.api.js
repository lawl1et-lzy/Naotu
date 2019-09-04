const express = require('express');
const router = express.Router();
const userIdentityControler = require('../controler/user_identity.controler.js');

router.post('/api/naotu/user_identity_create', userIdentityControler.create)

router.post('/api/naotu/user_identity_find', userIdentityControler.find)

router.post('/api/naotu/user_identity_findById', userIdentityControler.findById)

router.post('/api/naotu/user_identity_update', userIdentityControler.update)

router.post('/api/naotu/user_identity_remove', userIdentityControler.remove)

router.post('/api/naotu/user_identity_userConnectFunc', userIdentityControler.userConnectFunc)

module.exports = router