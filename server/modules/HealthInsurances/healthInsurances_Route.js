const express = require('express')
const router = express.Router()
const HIController = require('./healthInsurances_Controller')
const { verifyAccessToken } = require('../../helpers/jwtService')

router.post('/add', verifyAccessToken, HIController.addHI)
router.patch('/edit', verifyAccessToken, HIController.updateHI)
router.delete('/delete', verifyAccessToken, HIController.deleteHI)
router.get('/getall', verifyAccessToken, HIController.getAllHI)
router.get('/getbyid', verifyAccessToken, HIController.getByIdHI)
router.post('/dow', HIController.dowHI)

module.exports = router
