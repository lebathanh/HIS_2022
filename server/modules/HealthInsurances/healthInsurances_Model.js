const mongoose = require('mongoose')

const Schema = mongoose.Schema
const HealthInsurancesSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      unique: true,
      required: true,
    },
    benefitRate: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    place: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    obj: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    effectFrom: {
      type: Date,
      default: null,
    },
    effectTo: {
      type: Date,
      default: null,
    },
    bills: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: true,
    collection: 'HealthInsurances',
  }
)

module.exports = mongoose.model('HealthInsurances', HealthInsurancesSchema)
