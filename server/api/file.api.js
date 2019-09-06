const express = require('express');
const router = express.Router();
const naotuControler = require('../controler/file.controler.js')

router.post('/naotu/api/get_root_id', naotuControler.getRootId)

router.post('/naotu/api/add_file', naotuControler.addFile)

router.post('/naotu/api/rename', naotuControler.reName)

router.post('/naotu/api/add_directory', naotuControler.addDirectory)

router.post('/naotu/api/update', naotuControler.update)

router.post('/naotu/api/query_file', naotuControler.queryFile)

router.post('/naotu/api/query_directory', naotuControler.queryDirectory)

router.post('/naotu/api/query_self_directory_for_trash', naotuControler.querySelfDirectotyForTrash)

router.post('/naotu/api/rm', naotuControler.rm)

router.post('/naotu/api/revert_files', naotuControler.revertFiles)

router.post('/naotu/api/delete_files', naotuControler.deleteFiles)

module.exports = router;