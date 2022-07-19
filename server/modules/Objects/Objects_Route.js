const express = require('express')
const router = express.Router()
const ObjectsController = require('./Objects_Controller')
const { verifyAccessToken } = require('../../helpers/jwtService')

router.post('/add', verifyAccessToken, ObjectsController.addObjects)
router.patch('/edit', verifyAccessToken, ObjectsController.updateObjects)
router.delete('/delete', verifyAccessToken, ObjectsController.deleteObjects)
router.get('/getall', verifyAccessToken, ObjectsController.getAllObjects)
router.get('/getbyid', verifyAccessToken, ObjectsController.getByIdObjects)

module.exports = router
