const express = require('express')
const router = express.Router()
const AddressController = require('./address_Controller')

router.get('/getall', AddressController.getAddress)

module.exports = router
