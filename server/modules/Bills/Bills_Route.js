const express = require('express')
const router = express.Router()
const BillsController = require('./Bills_Controller')
const { verifyAccessToken } = require('../../helpers/jwtService')

router.post('/add', verifyAccessToken, BillsController.addBill)
router.patch('/edit', verifyAccessToken, BillsController.updateBill)
router.delete('/delete', verifyAccessToken, BillsController.deleteBill)
router.get('/getall', verifyAccessToken, BillsController.getAllBill)
router.get('/getbyid', verifyAccessToken, BillsController.getByIdBill)
router.get('/getbycus', verifyAccessToken, BillsController.getByCus)

module.exports = router
