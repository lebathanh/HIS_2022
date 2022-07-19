const express = require('express')
const app = express()
const createError = require('http-errors')
const cookiePaser = require('cookie-parser')
const cors = require('cors')
const morgan = require('morgan')
require('dotenv').config()

// Redis
const client = require('./config/connection_redis')

// Database
const dataBase = require('./config/dataBase')
dataBase.connect()

// Middleware
app.use(cors())
app.use(cookiePaser())
app.use(express.json({ limit: '200mb' }))
app.use(
  express.urlencoded({
    limit: '200mb',
    extended: true,
  })
)
app.use(express.static('public'))
app.use(morgan(':method :url :status - :response-time ms'))

//Route
const HIRoute = require('./modules/HealthInsurances/healthInsurances_Route')
const AdminRoute = require('./modules/Administrators/administrators_Route')
const CusGsRoute = require('./modules/CustomerGroups/CustomerGroups_Route')
const CusRoute = require('./modules/Customers/customers_Route')
const BRsRoute = require('./modules/BenefitRates/BenefitRates_Route')
const PlacesRoute = require('./modules/Places/Places_Route')
const ObjRoute = require('./modules/Objects/Objects_Route')
const MedicalFsRoute = require('./modules/MedicalFacilities/MedicalFacilities_Route')
const BillsRoute = require('./modules/Bills/Bills_Route')
const MSRoute = require('./modules/MedicalServices/MedicalServices_Route')
const TherapyRoute = require('./modules/Therapies/Therapies_Route')
const StatisRoute = require('./modules/Statisticals/Statisticals_Route')
const SettlementsRoute = require('./modules/Settlements/Settlements_Route')
const AddressRoute = require('./modules/Address/address_Route')

app.use('/admin', AdminRoute)
app.use('/insurance', HIRoute)
app.use('/cusgs', CusGsRoute)
app.use('/cus', CusRoute)
app.use('/brs', BRsRoute)
app.use('/places', PlacesRoute)
app.use('/obj', ObjRoute)
app.use('/mfs', MedicalFsRoute)
app.use('/bill', BillsRoute)
app.use('/ms', MSRoute)
app.use('/therapy', TherapyRoute)
app.use('/statis', StatisRoute)
app.use('/settlement', SettlementsRoute)
app.use('/address', AddressRoute)

// Handle Errors
const handleErrors = require('./helpers/handleErrors')
handleErrors(app)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log('Server listening on port ::: ', PORT)
})
