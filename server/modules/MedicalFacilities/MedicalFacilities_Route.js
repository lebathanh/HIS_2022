const express = require('express')
const router = express.Router()
const MedicalFs = require('./MedicalFacilities_Controller')
const { verifyAccessToken } = require('../../helpers/jwtService')

router.post('/add', verifyAccessToken, MedicalFs.addMedicalFs)
router.patch('/edit', verifyAccessToken, MedicalFs.updateMedicalFs)
router.delete('/delete', verifyAccessToken, MedicalFs.deleteMedicalFs)
router.get('/getall', verifyAccessToken, MedicalFs.getAllMedicalFs)
router.get('/getbyid', verifyAccessToken, MedicalFs.getByIdMedicalFs)
router.get('/search', verifyAccessToken, MedicalFs.searchMedicalFs)

module.exports = router
