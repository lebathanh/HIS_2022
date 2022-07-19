const mongoose = require('mongoose')

const Schema = mongoose.Schema
const CustomerGroupsSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
      },
    ],
    joinType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'CustomerGroups',
  }
)

module.exports = mongoose.model('CustomerGroups', CustomerGroupsSchema)
