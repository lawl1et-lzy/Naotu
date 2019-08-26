const express = require('express');
const router = express.Router();
const userApi = require('./user.api.js');
const naotuApi = require('./naotu.api.js');

router.use(userApi)
router.use(naotuApi)

module.exports = router



