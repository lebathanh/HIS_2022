const mongoose = require('mongoose')

const Schema = mongoose.Schema
const BillsSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      unique: true,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    money: {
      type: Number,
      required: true,
    },
    paid: {
      type: Boolean,
      default: false,
    },
    dateOfIssue: {
      type: Date,
      default: null,
    },
    receiver: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: 'Bills',
  }
)

module.exports = mongoose.model('Bills', BillsSchema)
