const express = require('express');
const router = express.Router();
const identityControler = require('../controler/identity.controler.js');

router.post('/naotu/api/identity_create', identityControler.create)

router.post('/naotu/api/identity_find', identityControler.find)

router.post('/naotu/api/identity_findById', identityControler.findById)

router.post('/naotu/api/identity_update', identityControler.update)

router.post('/naotu/api/identity_remove', identityControler.remove)

module.exports = router