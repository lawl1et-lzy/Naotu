const express = require('express');
const router = express.Router();
const userApi = require('./user.api.js');
const fileApi = require('./file.api.js');
const funcApi = require('./func.api.js');
const identityApi = require('./identity.api.js');
const identityFuncApi = require('./identity_func.api.js');
const userIdentityApi = require('./user_identity.api.js');
const fileManageApi = require('./fileManage.api.js');

router.use(userApi)
router.use(fileApi)
router.use(funcApi)
router.use(identityApi)
router.use(identityFuncApi)
router.use(userIdentityApi)
router.use(fileManageApi)

module.exports = router



