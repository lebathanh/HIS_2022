const express = require('express')
const router = express.Router()
const AdminsController = require('./administrators_Controller')
const { verifyAccessToken } = require('../../helpers/jwtService')

router.post('/add', verifyAccessToken, AdminsController.createAdmin)
router.delete('/delete', verifyAccessToken, AdminsController.deleteAdmin)
router.post('/login', AdminsController.loginAdmin)
router.get('/get-admin', verifyAccessToken, AdminsController.getAdmin)
router.get('/getall', verifyAccessToken, AdminsController.getAllAdmin)
router.patch('/changepass', verifyAccessToken, AdminsController.changePasswordAdmin)
router.patch('/edit', verifyAccessToken, AdminsController.changePassword)
router.post('/forgot', AdminsController.forGotPassword)
router.patch('/reset', verifyAccessToken, AdminsController.resetPassword)
router.post('/refresh-token', AdminsController.refreshToken)
router.delete('/logout', AdminsController.logOutAdmin)

module.exports = router
