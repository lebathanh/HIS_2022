const mongoose = require('mongoose')

const Schema = mongoose.Schema
const BenefitRatesSchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    rates: {
      type: Number,
      default: 0.8,
      required: true,
    },
    objs: {
      type: Array,
      default: [],
    },
    descriptions: {
      type: String,
      default: 'Descriptions',
    },
  },
  {
    timestamps: true,
    collection: 'BenefitRates',
  }
)

module.exports = mongoose.model('BenefitRates', BenefitRatesSchema)
