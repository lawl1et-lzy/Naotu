const express = require('express');
const router = express.Router();
const userApi = require('./user.api.js');
const fileApi = require('./file.api.js');
const funcApi = require('./func.api.js');

router.use(userApi)
router.use(fileApi)
router.use(funcApi)

module.exports = router



