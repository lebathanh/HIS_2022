const express = require('express')
const router = express.Router()
const PlacesController = require('./Places_Controller')
const { verifyAccessToken } = require('../../helpers/jwtService')

router.post('/add', verifyAccessToken, PlacesController.addPlaces)
router.patch('/edit', verifyAccessToken, PlacesController.updatePlaces)
router.delete('/delete', verifyAccessToken, PlacesController.deletePlaces)
router.get('/getall', verifyAccessToken, PlacesController.getAllPlaces)
router.get('/getbyid', verifyAccessToken, PlacesController.getByIdPlaces)

module.exports = router
