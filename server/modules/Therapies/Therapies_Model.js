const mongoose = require('mongoose')

const Schema = mongoose.Schema
const TherapiesSchema = new Schema(
  {
    customer: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    hID: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    services: {
      type: Array,
      default: [],
    },
    time: {
      type: Date,
      required: true,
    },
    medicalF: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    therapyFee: {
      type: Number,
      required: true,
    },
    realFee: {
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
    collection: 'Therapies',
  }
)

module.exports = mongoose.model('Therapies', TherapiesSchema)
