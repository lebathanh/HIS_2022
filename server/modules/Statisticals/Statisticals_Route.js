const express = require('express')
const router = express.Router()
const StatisticalsController = require('./Statisticals_Controller')
const { verifyAccessToken } = require('../../helpers/jwtService')

router.post('/add', verifyAccessToken, StatisticalsController.addStatis)
router.patch('/edit', verifyAccessToken, StatisticalsController.updateStatis)
router.delete('/delete', verifyAccessToken, StatisticalsController.deleteStatis)
router.get('/getall', verifyAccessToken, StatisticalsController.getAllStatis)
router.get('/getbyid', verifyAccessToken, StatisticalsController.getByIdStatis)
router.get('/filter', verifyAccessToken, StatisticalsController.filtersStatis)
router.get('/file', StatisticalsController.createFile)

module.exports = router
