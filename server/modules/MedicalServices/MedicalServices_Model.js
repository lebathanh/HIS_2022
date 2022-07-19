const mongoose = require('mongoose')

const Schema = mongoose.Schema
const MedicalServicesSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    calculationUnit: {
      type: String,
      required: true,
    },
    prices: {
      type: String,
      required: true,
    },
    objects: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    descriptions: {
      type: String,
      default: 'descriptions',
    },
  },
  {
    timestamps: true,
    collection: 'MedicalServices',
  }
)

module.exports = mongoose.model('MedicalServices', MedicalServicesSchema)
