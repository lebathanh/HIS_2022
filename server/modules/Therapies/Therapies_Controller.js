const TherapyModel = require('./Therapies_Model')
const CusModel = require('../Customers/customers_Model.js')
const HIModel = require('../HealthInsurances/healthInsurances_Model')
const MFsModel = require('../MedicalFacilities/MedicalFacilities_Model')
const MSsModel = require('../MedicalServices/MedicalServices_Model')
const createError = require('http-errors')
const { TherapyValidate, updateTherapyValidate } = require('../../helpers/validation')

class TherapiesController {
  async addTheraphy(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = TherapyValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const foundCus = await CusModel.findOne({
            _id: req.body.customer,
          })
          if (!foundCus) {
            throw createError.BadRequest('Customer is not exist')
          } else {
            const foundHI = await HIModel.findOne({
              _id: req.body.hID,
            })
            if (!foundHI) {
              throw createError.BadRequest('This customer do not have a HI')
            } else {
              if (foundHI.customer.toString() !== foundCus._id.toString()) {
                throw createError.BadRequest('HI id is incorrectly')
              } else {
                const foundMF = await MFsModel.findOne({
                  _id: req.body.medicalF,
                })
                if (!foundMF) {
                  throw createError.BadRequest('MF is not exist')
                } else {
                  const newTherapy = await new TherapyModel(req.body)
                  const element = await newTherapy.save()
                  res.json({
                    status: 'OK',
                    elements: element,
                  })
                }
              }
            }
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async updateTheraphy(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = updateTherapyValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const foundTherapy = await TherapyModel.findOne({
            _id: req.body._id,
          })
          if (!foundTherapy) {
            throw createError.BadRequest('Therary is not exist')
          } else {
            // validate data
            if (req.body.customer && req.body.hID && req.body.customer !== foundTherapy.customer && req.body.hID !== foundTherapy.hID) {
              const foundCus = await CusModel.findOne({
                _id: req.body.customer,
              })
              if (!foundCus) {
                throw createError.BadRequest('Customer is not exist')
              } else {
                const foundHI = await HIModel.findOne({
                  _id: req.body.hID,
                })
                if (!foundHI) {
                  throw createError.BadRequest('This customer do not have a HI')
                } else {
                  if (foundHI.customer.toString() !== foundCus._id.toString()) {
                    throw createError.BadRequest('HI id is incorrectly')
                  } else {
                    foundTherapy.customer = req.body.customer || foundTherapy.customer
                    foundTherapy.hID = req.body.hID || foundTherapy.hID
                  }
                }
              }
            }

            if (req.body.medicalF && req.body.medicalF !== foundTherapy.medicalF) {
              const foundMF = await MFsModel.findOne({
                _id: req.body.medicalF,
              })
              if (!foundMF) {
                throw createError.BadRequest('MF is not exist')
              } else {
                foundTherapy.medicalF = req.body.medicalF || foundTherapy.medicalF
              }
            }

            foundTherapy.time = req.body.time || foundTherapy.time
            foundTherapy.services = req.body.services || foundTherapy.services
            foundTherapy.therapyFee = req.body.therapyFee || foundTherapy.therapyFee
            foundTherapy.realFee = req.body.realFee || foundTherapy.realFee

            if (req.body.status !== null && req.body.status !== foundTherapy.status) {
              foundTherapy.status = req.body.status || foundTherapy.status
            }

            const element = await foundTherapy.save()

            res.json({
              status: 'OK',
              elements: element,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async deleteTheraphy(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id is require in query')
        } else {
          const foundTherapy = await TherapyModel.findOne({
            _id: req.query._id,
          })
          if (!foundTherapy) {
            throw createError.BadRequest('Therapy does not exist')
          } else {
            await TherapyModel.deleteOne({
              _id: req.query._id,
            })
            res.json({
              status: 'OK',
              elements: {},
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async getAllTheraphy(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const perPage = 999
        const page = (await req.params.page) || 1
        const pagesSize = await TherapyModel.find()
          .countDocuments()
          .then((num) => Math.ceil(num / perPage))

        const Therapies = await TherapyModel.find()
          .populate([
            {
              path: 'customer',
              model: 'Customers',
            },
            {
              path: 'hID',
              model: 'HealthInsurances',
              populate: [
                {
                  path: 'customer',
                  model: 'Customers',
                },
                {
                  path: 'benefitRate',
                  model: 'BenefitRates',
                },
              ],
            },
            {
              path: 'medicalF',
              model: 'MedicalFacilities',
            },
          ])
          .sort({})
          .skip(perPage * page - perPage)
          .limit(perPage)

        res.json({
          status: 'OK',
          elements: { page: parseInt(page), pagesSize, Therapies },
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async getByIdTheraphy(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id require in query')
        } else {
          const foundTherapy = await TherapyModel.findOne({
            _id: req.query._id,
          })
          if (!foundTherapy) {
            throw createError.BadRequest('Therapy does not exit')
          } else {
            res.json({
              status: 'OK',
              elements: foundTherapy,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new TherapiesController()
