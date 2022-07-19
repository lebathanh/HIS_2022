const mongoose = require('mongoose')

const Schema = mongoose.Schema
const CustomersSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    birth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    citizenship: {
      type: String,
      required: true,
    },
    ethnic: {
      type: String,
      required: true,
    },
    idCard: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfIssue: {
      type: Date,
    },
    place: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    birthCertificatePlace: {
      type: String,
      required: true,
    },
    guardian: {
      type: Schema.Types.ObjectId,
    },
    province: {
      type: Object,
    },
    district: {
      type: Object,
    },
    ward: {
      type: Object,
    },
    address: {
      type: String,
      required: true,
    },
    job: {
      type: String,
    },
    salary: {
      type: Number,
    },
    cusGroups: [
      {
        type: Schema.Types.ObjectId,
        default: [],
      },
    ],
    avatar: {
      type: Object,
    },
  },
  {
    timestamps: true,
    collection: 'Customers',
  }
)

module.exports = mongoose.model('Customers', CustomersSchema)
