const express = require('express')
const router = express.Router()
const MSController = require('./MedicalServices_Controller')
const { verifyAccessToken } = require('../../helpers/jwtService')

router.post('/add', verifyAccessToken, MSController.addMS)
router.patch('/edit', verifyAccessToken, MSController.updateMS)
router.delete('/delete', verifyAccessToken, MSController.deleteMS)
router.get('/getall', verifyAccessToken, MSController.getAllMS)
router.get('/getbyid', verifyAccessToken, MSController.getByIdMS)
router.get('/search', verifyAccessToken, MSController.searchMS)

module.exports = router
