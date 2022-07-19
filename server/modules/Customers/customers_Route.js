const express = require('express')
const router = express.Router()
const CusController = require('./customers_Controller')
const { verifyAccessToken } = require('../../helpers/jwtService')

router.post('/add', verifyAccessToken, CusController.createCus)
router.patch('/edit', verifyAccessToken, CusController.updateCus)
router.delete('/delete', verifyAccessToken, CusController.deleteCus)
router.get('/getall/:page', verifyAccessToken, CusController.getAllCus)
router.get('/getbyid', verifyAccessToken, CusController.getCusById)
router.get('/getbyidcard', verifyAccessToken, CusController.getCusByIdCard)
router.get('/search', verifyAccessToken, CusController.searchCus)

module.exports = router
