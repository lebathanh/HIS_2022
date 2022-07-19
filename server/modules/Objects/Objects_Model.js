const mongoose = require('mongoose')

const Schema = mongoose.Schema
const ObjectsSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    descriptions: {
      type: String,
      default: 'Descriptions',
    },
  },
  {
    timestamps: true,
    collection: 'Objects',
  }
)

module.exports = mongoose.model('Objects', ObjectsSchema)
