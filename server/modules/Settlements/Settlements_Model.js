const mongoose = require('mongoose')

const Schema = mongoose.Schema
const SettlementsSchema = new Schema(
  {
    medicalF: {
      type: Schema.Types.ObjectId,
    },
    statisticals: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    quarter: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'Settlements',
  }
)

module.exports = mongoose.model('Settlements', SettlementsSchema)
