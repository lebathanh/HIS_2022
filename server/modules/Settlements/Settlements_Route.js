const express = require('express')
const router = express.Router()
const SettlementsController = require('./Settlements_Controller')
const { verifyAccessToken } = require('../../helpers/jwtService')

router.post('/add', verifyAccessToken, SettlementsController.addSettlement)
router.patch('/edit', verifyAccessToken, SettlementsController.updateSettlement)
router.delete('/delete', verifyAccessToken, SettlementsController.deleteSettlement)
router.get('/getall', verifyAccessToken, SettlementsController.getAllSettlement)
router.get('/getbyid', verifyAccessToken, SettlementsController.getByIdSettlement)
router.get('/filter', verifyAccessToken, SettlementsController.filtersSettlement)

module.exports = router
