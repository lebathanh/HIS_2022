const express = require('express')
const router = express.Router()
const TherapiesController = require('./Therapies_Controller')
const { verifyAccessToken } = require('../../helpers/jwtService')

router.post('/add', verifyAccessToken, TherapiesController.addTheraphy)
router.patch('/edit', verifyAccessToken, TherapiesController.updateTheraphy)
router.delete('/delete', verifyAccessToken, TherapiesController.deleteTheraphy)
router.get('/getall', verifyAccessToken, TherapiesController.getAllTheraphy)
router.get('/getbyid', verifyAccessToken, TherapiesController.getByIdTheraphy)

module.exports = router
