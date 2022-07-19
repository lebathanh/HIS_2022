const mongoose = require('mongoose')

const Schema = mongoose.Schema
const StatisticalsSchema = new Schema(
  {
    medicalF: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    therapies: {
      type: Array,
      default: [],
    },
    medicalS: {
      type: Array,
      default: [],
    },
    // CSYT thu
    medicalFCollect: {
      type: Number,
      required: true,
    },
    // CSYT chi
    medicalFSpend: {
      type: Number,
      required: true,
    },
    // pPR dư kỳ trước (previous period's residual expenses)
    pPRFunds: {
      type: Number,
      required: true,
    },
    // pPR phát trong kỳ (Disbursement in the period)
    dIPFunds: {
      type: Number,
      required: true,
    },
    // Kinh phí đã sử dụng
    usedFunds: {
      type: Number,
      required: true,
    },
    // Kinh phí chuyển kỳ sau
    nextFunds: {
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
    collection: 'Statisticals',
  }
)

module.exports = mongoose.model('Statisticals', StatisticalsSchema)
