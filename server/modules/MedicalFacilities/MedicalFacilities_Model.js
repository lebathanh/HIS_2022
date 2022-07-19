const mongoose = require('mongoose')

const Schema = mongoose.Schema
const MedicalFacilitiesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
      default: 'address',
    },
  },
  {
    timestamps: true,
    collection: 'MedicalFacilities',
  }
)

module.exports = mongoose.model('MedicalFacilities', MedicalFacilitiesSchema)
