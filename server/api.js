const express = require('express');
const router = express.Router();
const naotuControler = require('./controler/naotu.controler.js')

// getRootGuid
router.post('/api/naotu/get_root_guid', naotuControler.getRootGuid)

// addFile
router.post('/api/naotu/add_file', naotuControler.addFile)

// reName
router.post('/api/naotu/rename', naotuControler.reName)

// addDirectory
router.post('/api/naotu/add_directory', naotuControler.addDirectory)

// update
router.post('/api/naotu/update', naotuControler.update)

// del
router.post('/api/naotu/del', naotuControler.del)

// rm 
router.post('/api/naotu/rm', naotuControler.rm)

// queryFile
router.post('/api/naotu/query_file', naotuControler.queryFile)

// queryDirectoty
router.post('/api/naotu/query_directory', naotuControler.queryDirectoty)

module.exports = router;