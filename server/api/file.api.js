const express = require('express');
const router = express.Router();
const naotuControler = require('../controler/file.controler.js')

router.post('/api/naotu/get_root_id', naotuControler.getRootId)

router.post('/api/naotu/add_file', naotuControler.addFile)

router.post('/api/naotu/rename', naotuControler.reName)

router.post('/api/naotu/add_directory', naotuControler.addDirectory)

router.post('/api/naotu/update', naotuControler.update)

router.post('/api/naotu/query_file', naotuControler.queryFile)

router.post('/api/naotu/query_directory', naotuControler.queryDirectory)

router.post('/api/naotu/query_self_directory_for_trash', naotuControler.querySelfDirectotyForTrash)

router.post('/api/naotu/rm', naotuControler.rm)

router.post('/api/naotu/revert_files', naotuControler.revertFiles)

router.post('/api/naotu/delete_files', naotuControler.deleteFiles)

module.exports = router;