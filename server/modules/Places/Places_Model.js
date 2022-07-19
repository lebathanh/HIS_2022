const mongoose = require('mongoose')

const Schema = mongoose.Schema
const PlacesSchema = new Schema(
  {
    id: {
      type: String,
      unique: true,
      required: true,
    },
    descriptions: {
      type: String,
      default: 'Descriptions',
    },
  },
  {
    timestamps: true,
    collection: 'Places',
  }
)

module.exports = mongoose.model('Places', PlacesSchema)
