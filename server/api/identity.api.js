const express = require('express');
const router = express.Router();
const identityControler = require('../controler/identity.controler.js');

router.post('/api/naotu/identity_create', identityControler.create)

router.post('/api/naotu/identity_find', identityControler.find)

router.post('/api/naotu/identity_findById', identityControler.findById)

router.post('/api/naotu/identity_update', identityControler.update)

router.post('/api/naotu/identity_remove', identityControler.remove)

module.exports = router