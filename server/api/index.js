const express = require('express');
const router = express.Router();
const userApi = require('./user.api.js');
const fileApi = require('./file.api.js');

router.use(userApi)
router.use(fileApi)

module.exports = router



