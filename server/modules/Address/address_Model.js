const mongoose = require('mongoose')

const Schema = mongoose.Schema
const AddressSchema = new Schema(
  {
    code: Number,
    codename: String,
    districts: Array,
    division_type: String,
    name: String,
    phone_code: Number,
  },
  {
    timestamps: true,
    collection: 'Address',
  }
)

module.exports = mongoose.model('Address', AddressSchema)
