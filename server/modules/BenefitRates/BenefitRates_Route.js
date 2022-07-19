const express = require('express')
const router = express.Router()
const BRsController = require('./BenefitRates_Controller')
const { verifyAccessToken } = require('../../helpers/jwtService')

router.post('/add', verifyAccessToken, BRsController.addBRs)
router.patch('/edit', verifyAccessToken, BRsController.updateBRs)
router.delete('/delete', verifyAccessToken, BRsController.deleteBRs)
router.get('/getall', verifyAccessToken, BRsController.getAllBRs)
router.get('/getbyid', verifyAccessToken, BRsController.getByIdBRs)

module.exports = router
