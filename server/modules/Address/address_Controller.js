const AddressModel = require('./address_Model')

class AdministratorsController {
  async getAddress(req, res, next) {
    const addresses = await AddressModel.find()
    res.json({
      status: 'OK',
      elements: addresses,
    })
  }
}

module.exports = new AdministratorsController()
