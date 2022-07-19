const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Schema = mongoose.Schema
const AdministratorsSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    isSuper: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: 'Administrators',
  }
)

AdministratorsSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(this.password, salt)
    this.password = hashPassword
    next()
  } catch (error) {
    next(error)
  }
})

AdministratorsSchema.methods.isCheckPassword = async function (pass) {
  try {
    return await bcrypt.compare(pass, this.password)
  } catch (error) {}
}

module.exports = mongoose.model('Administrators', AdministratorsSchema)
