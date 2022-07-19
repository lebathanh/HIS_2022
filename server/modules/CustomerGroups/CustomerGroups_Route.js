const express = require('express')
const router = express.Router()
const CusGroupsController = require('./CustomerGroups_Controller')
const { verifyAccessToken } = require('../../helpers/jwtService')

router.post('/add', verifyAccessToken, CusGroupsController.createCusGs)
router.patch('/edit', verifyAccessToken, CusGroupsController.updateCusGs)
router.delete('/delete', verifyAccessToken, CusGroupsController.deleteCusGrs)
router.patch('/addmembers', verifyAccessToken, CusGroupsController.addMember)
router.delete('/deletemembers', verifyAccessToken, CusGroupsController.deleteMember)
router.get('/getall/:page', verifyAccessToken, CusGroupsController.getAllCusGs)
router.get('/getbyid', verifyAccessToken, CusGroupsController.getCusGsById)
router.get('/search', verifyAccessToken, CusGroupsController.searchCusGs)

module.exports = router
